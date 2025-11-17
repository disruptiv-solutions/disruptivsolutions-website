import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// GET - Fetch single resource by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const resourceRef = doc(db, 'resources', id);
    const resourceSnap = await getDoc(resourceRef);

    if (!resourceSnap.exists()) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    const data = resourceSnap.data();
    const resource: Record<string, unknown> = {
      id: resourceSnap.id,
      ...(data || {}),
    };
    
    // Convert Firestore Timestamps to serializable format
    if (data?.createdAt && typeof (data.createdAt as { toDate?: () => Date }).toDate === 'function') {
      resource.createdAt = (data.createdAt as { toDate: () => Date }).toDate().toISOString();
    }
    
    if (data?.lastUpdated && typeof (data.lastUpdated as { toDate?: () => Date }).toDate === 'function') {
      resource.lastUpdated = (data.lastUpdated as { toDate: () => Date }).toDate().toISOString();
    }
    
    return NextResponse.json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error('[API:resources:id] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// PUT - Update resource
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const resourceRef = doc(db, 'resources', id);
    const resourceSnap = await getDoc(resourceRef);

    if (!resourceSnap.exists()) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      lastUpdated: Timestamp.now(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (type !== undefined) updateData.type = type;
    if (icon !== undefined) {
      // Default to 📄 if icon is empty or not provided
      updateData.icon = icon && icon.trim() !== '' ? icon.trim() : '📄';
    }
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imagePrompt !== undefined) updateData.imagePrompt = imagePrompt;
    if (tldr !== undefined) updateData.tldr = tldr || '';
    if (published !== undefined) updateData.published = published;

    await updateDoc(resourceRef, updateData);

    return NextResponse.json({
      success: true,
      message: 'Resource updated successfully',
    });
  } catch (error) {
    console.error('[API:resources:id] PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    );
  }
}

// DELETE - Delete resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get userId from query params or body
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
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
    
    const resourceRef = doc(db, 'resources', id);
    const resourceSnap = await getDoc(resourceRef);

    if (!resourceSnap.exists()) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    await deleteDoc(resourceRef);

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('[API:resources:id] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}

