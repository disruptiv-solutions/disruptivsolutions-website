import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

interface Resource {
  id?: string;
  title: string;
  description: string;
  type: 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video';
  icon: string;
  content: {
    sections: Array<{
      heading?: string;
      text?: string;
      items?: string[];
      code?: string;
      note?: string;
    }>;
  };
  lastUpdated?: string;
  createdAt?: string;
  published: boolean;
}

// GET - Fetch all resources
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const publishedOnly = searchParams.get('published') === 'true';

    const resourcesRef = collection(db, 'resources');
    const q = query(resourcesRef, orderBy('createdAt', 'desc'));

    const snapshot = await getDocs(q);
    const resources: Resource[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter by published status if requested
      if (!publishedOnly || data.published === true) {
        resources.push({
          id: doc.id,
          ...data,
        } as Resource);
      }
    });

    return NextResponse.json({ 
      success: true, 
      resources 
    });
  } catch (error) {
    console.error('[API:resources] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST - Create new resource
export async function POST(request: NextRequest) {
  try {
    // Verify admin status (check if user is admin)
    // Note: In production, verify using Firebase Admin SDK with auth token
    
    const body = await request.json();
    const { title, description, type, icon, content, published, userId } = body;
    
    // Verify admin if userId is provided
    if (userId) {
      const { isAdmin } = await import('@/lib/adminConfig');
      if (!isAdmin(userId)) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin access required' },
          { status: 403 }
        );
      }
    }

    // Validation
    if (!title || !description || !type || !icon || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const resourceData = {
      title: title.trim(),
      description: description.trim(),
      type,
      icon,
      content,
      published: published ?? false,
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
    };

    const resourcesRef = collection(db, 'resources');
    const docRef = await addDoc(resourcesRef, resourceData);

    return NextResponse.json(
      {
        success: true,
        resource: {
          id: docRef.id,
          ...resourceData,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API:resources] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

