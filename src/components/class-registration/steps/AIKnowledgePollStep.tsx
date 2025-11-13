import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

interface PollVotes {
  clueless: number;
  little: number;
  goodAmount: number;
  expert: number;
}

const POLL_OPTIONS = [
  { id: 'clueless', label: 'Clueless', image: '/clueless.png' },
  { id: 'little', label: 'A little', image: '/beginner.png' },
  { id: 'goodAmount', label: 'A good amount', image: '/proficient.png' },
  { id: 'expert', label: 'Expert', image: '/wizard.png' },
] as const;

const COLLECTION_NAME = 'ai-knowledge-poll';

export const AIKnowledgePollStep: React.FC = () => {
  const [votes, setVotes] = useState<PollVotes>({
    clueless: 0,
    little: 0,
    goodAmount: 0,
    expert: 0,
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justVoted, setJustVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time Firestore listener
  useEffect(() => {
    const votesRef = collection(db, COLLECTION_NAME);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      votesRef,
      (querySnapshot) => {
        const results: PollVotes = {
          clueless: 0,
          little: 0,
          goodAmount: 0,
          expert: 0,
        };

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const option = data.option;
          if (option && results.hasOwnProperty(option)) {
            results[option as keyof PollVotes]++;
          }
        });

        setVotes(results);
        setIsLoading(false);
        console.log('[AIKnowledgePollStep] Real-time update:', results);
      },
      (error) => {
        console.error('[AIKnowledgePollStep] Firestore listener error:', error);
        setIsLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleVote = async (optionId: string) => {
    if (isSubmitting) return;

    if (!['clueless', 'little', 'goodAmount', 'expert'].includes(optionId)) {
      return;
    }

    setIsSubmitting(true);
    setJustVoted(true);

    try {
      // Add vote directly to Firestore
      const votesRef = collection(db, COLLECTION_NAME);
      await addDoc(votesRef, {
        option: optionId,
        timestamp: Date.now(),
      });

      setSelectedOption(optionId);
      console.log('[AIKnowledgePollStep] Vote submitted successfully');
      
      // Real-time listener will automatically update the votes
    } catch (error) {
      console.error('[AIKnowledgePollStep] Error submitting vote:', error);
      alert('Failed to submit vote. Please try again.');
      setJustVoted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaxCount = () => {
    return Math.max(votes.clueless, votes.little, votes.goodAmount, votes.expert);
  };

  const getFontSize = (count: number) => {
    const maxCount = getMaxCount();
    if (maxCount === 0) return 'text-2xl';
    
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 'text-6xl';
    if (ratio >= 0.5) return 'text-5xl';
    if (ratio >= 0.3) return 'text-4xl';
    if (ratio > 0) return 'text-3xl';
    return 'text-2xl';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          How much do you know about AI app Development?
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {POLL_OPTIONS.map((option) => {
          const count = votes[option.id as keyof PollVotes];
          const isSelected = selectedOption === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleVote(option.id)}
              disabled={isSubmitting}
              className={`relative group bg-zinc-900/60 rounded-3xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-red-600 scale-105 shadow-lg shadow-red-600/30'
                  : isSubmitting
                  ? 'border-gray-700 opacity-60 cursor-not-allowed'
                  : 'border-gray-700 hover:border-gray-500 hover:scale-105'
              }`}
            >
              {/* Vote count above image */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div
                  className={`${getFontSize(count)} font-bold text-white drop-shadow-lg ${
                    isSelected ? 'text-red-400' : 'text-gray-300'
                  }`}
                >
                  {count}
                </div>
              </div>

              {/* Image */}
              <div className="aspect-square bg-zinc-800 rounded-3xl flex items-center justify-center p-8 overflow-hidden">
                <Image
                  src={option.image}
                  alt={option.label}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain rounded-3xl"
                  unoptimized
                />
              </div>

              {/* Label below image */}
              <div className="p-6 text-center">
                <p
                  className={`text-lg font-semibold ${
                    isSelected ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {option.label}
                </p>
                {isSelected && (
                  <p className="text-sm text-gray-400 mt-2">You selected this</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {justVoted && (
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            Thanks for voting! Results update in real-time.
          </p>
        </div>
      )}
    </div>
  );
};

