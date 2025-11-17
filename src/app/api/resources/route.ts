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
  imageUrl?: string;
  imagePrompt?: string;
  tldr?: string;
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
        // Convert Firestore Timestamps to serializable format
        const resource: Resource = {
          id: doc.id,
          ...data,
        } as Resource;
        
        // Convert createdAt Timestamp to ISO string if it exists
        if (data.createdAt && typeof data.createdAt.toDate === 'function') {
          resource.createdAt = data.createdAt.toDate().toISOString();
        }
        
        // Convert lastUpdated Timestamp to ISO string if it exists
        if (data.lastUpdated && typeof data.lastUpdated.toDate === 'function') {
          resource.lastUpdated = data.lastUpdated.toDate().toISOString();
        }
        
        resources.push(resource);
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
    const { title, description, type, icon, content, published, imageUrl, imagePrompt, tldr, userId } = body;
    
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

    // Validation with detailed error messages
    const missingFields: string[] = [];
    if (!title || title.trim() === '') missingFields.push('title');
    if (!description || description.trim() === '') missingFields.push('description');
    if (!type) missingFields.push('type');
    // Icon is optional - will default to 📄 if not provided
    if (!content || !content.sections || !Array.isArray(content.sections)) {
      missingFields.push('content (sections array)');
    }
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          missingFields 
        },
        { status: 400 }
      );
    }

    const resourceData = {
      title: title.trim(),
      description: description.trim(),
      type,
      icon: icon && icon.trim() !== '' ? icon.trim() : '📄', // Default icon if not provided
      imageUrl: imageUrl || '',
      imagePrompt: imagePrompt || '',
      tldr: tldr || '',
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

