import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

interface PollResponse {
  clueless: number;
  little: number;
  goodAmount: number;
  expert: number;
}

const COLLECTION_NAME = 'ai-knowledge-poll';

// Aggregate votes from Firestore
async function getPollResults(): Promise<PollResponse> {
  try {
    const votesRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(votesRef);

    const results: PollResponse = {
      clueless: 0,
      little: 0,
      goodAmount: 0,
      expert: 0,
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const option = data.option;
      if (option && results.hasOwnProperty(option)) {
        results[option as keyof PollResponse]++;
      }
    });

    return results;
  } catch (error) {
    console.error('[API:ai-knowledge-poll] Error aggregating votes:', error);
    return {
      clueless: 0,
      little: 0,
      goodAmount: 0,
      expert: 0,
    };
  }
}

export async function GET() {
  try {
    const pollVotes = await getPollResults();
    const total = pollVotes.clueless + pollVotes.little + pollVotes.goodAmount + pollVotes.expert;

    return NextResponse.json({
      votes: pollVotes,
      total,
    });
  } catch (error) {
    console.error('[API:ai-knowledge-poll] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch poll results' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { option } = body;

    if (!option || !['clueless', 'little', 'goodAmount', 'expert'].includes(option)) {
      return NextResponse.json(
        { error: 'Invalid option' },
        { status: 400 }
      );
    }

    // Add vote to Firestore
    const votesRef = collection(db, COLLECTION_NAME);
    await addDoc(votesRef, {
      option,
      timestamp: Date.now(),
    });

    // Get updated results
    const pollVotes = await getPollResults();
    const total = pollVotes.clueless + pollVotes.little + pollVotes.goodAmount + pollVotes.expert;

    return NextResponse.json({
      success: true,
      votes: pollVotes,
      total,
    });
  } catch (error) {
    console.error('[API:ai-knowledge-poll] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    );
  }
}

