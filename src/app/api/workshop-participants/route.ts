import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  limit as firestoreLimit,
  startAfter,
  getDoc,
  Timestamp,
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

interface Participant {
  id: string;
  name: string;
  location: string;
  wantToBuild: string;
  timestamp: number;
  color?: string;
}

const COLLECTION_NAME = 'workshop-participants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Get all participants sorted by timestamp descending
    const participantsRef = collection(db, COLLECTION_NAME);
    const q = query(
      participantsRef,
      orderBy('timestamp', 'desc'),
      firestoreLimit(limit)
    );

    const querySnapshot = await getDocs(q);
    const participants: Participant[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      participants.push({
        id: doc.id,
        name: data.name,
        location: data.location,
        wantToBuild: data.wantToBuild,
        timestamp: data.timestamp,
        color: data.color || '#fef08a',
      });
    });

    return NextResponse.json({
      participants,
      total: participants.length,
      page,
    });
  } catch (error) {
    console.error('[API:workshop-participants] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, location, wantToBuild, color } = body;

    if (!name || !location || !wantToBuild) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newParticipant = {
      name: name.trim(),
      location: location.trim(),
      wantToBuild: wantToBuild.trim().substring(0, 100),
      timestamp: Date.now(),
      color: color || '#fef08a',
    };

    const participantsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(participantsRef, newParticipant);

    return NextResponse.json(
      {
        success: true,
        participant: {
          id: docRef.id,
          ...newParticipant,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API:workshop-participants] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add participant' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete specific participant
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } else {
      // Clear all participants
      const participantsRef = collection(db, COLLECTION_NAME);
      const querySnapshot = await getDocs(participantsRef);
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API:workshop-participants] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete participant' },
      { status: 500 }
    );
  }
}

