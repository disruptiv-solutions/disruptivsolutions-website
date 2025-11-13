import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit as firestoreLimit,
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

interface DeployedSite {
  id: string;
  url: string;
  description: string;
  timestamp: number;
  screenshotUrl?: string | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Query Firestore for deployed sites
    const sitesRef = collection(db, 'deployed-sites');
    const q = query(sitesRef, orderBy('timestamp', 'desc'), firestoreLimit(limit));
    const querySnapshot = await getDocs(q);

    const sites: DeployedSite[] = [];
    querySnapshot.forEach((doc) => {
      sites.push({
        id: doc.id,
        ...doc.data(),
      } as DeployedSite);
    });

    return NextResponse.json({
      sites,
      total: sites.length,
    });
  } catch (error) {
    console.error('[API:deployed-sites] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deployed sites' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, description } = body;

    if (!url || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const trimmedUrl = url.trim();
    const trimmedDescription = description.trim().substring(0, 60);
    const timestamp = Date.now();

    const { adminDb, adminStorage, error: adminError } = initFirebaseAdmin();

    if (!adminDb || !adminStorage) {
      return NextResponse.json(
        {
          error: adminError || 'Failed to initialize Firebase Admin SDK.',
          details:
            'Ensure FIREBASE_SERVICE_ACCOUNT_KEY and FIREBASE_STORAGE_BUCKET are configured.',
        },
        { status: 500 }
      );
    }

    const docRef = adminDb.collection('deployed-sites').doc();

    let screenshotUrl: string | null = null;
    let browser;

    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
      });
      await page.goto(trimmedUrl, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(2000);

      const screenshotBuffer = await page.screenshot({
        fullPage: true,
        type: 'png',
      });

      const filePath = `deployed-sites/${docRef.id}.png`;
      const file = adminStorage.file(filePath);
      await file.save(screenshotBuffer, {
        contentType: 'image/png',
        cacheControl: 'public,max-age=31536000,immutable',
      });

      await file.makePublic();
      screenshotUrl = `https://storage.googleapis.com/${adminStorage.name}/${filePath}`;
    } catch (screenshotError) {
      console.error('[API:deployed-sites] Screenshot capture failed:', screenshotError);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    const siteData: Omit<DeployedSite, 'id'> = {
      url: trimmedUrl,
      description: trimmedDescription,
      timestamp,
      screenshotUrl,
    };

    await docRef.set(siteData);

    console.log(`[API:deployed-sites] Site added: ${docRef.id} - ${trimmedDescription}`);

    return NextResponse.json(
      {
        success: true,
        site: {
          id: docRef.id,
          ...siteData,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API:deployed-sites] POST error:', error);
    
    // Check if it's a Firestore not initialized error
    if (error?.code === 'not-found' || error?.message?.includes('NOT_FOUND')) {
      return NextResponse.json(
        { 
          error: 'Database not initialized. Please enable Firestore in Firebase Console.',
          details: 'Go to Firebase Console → Firestore Database → Create database'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit site',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

