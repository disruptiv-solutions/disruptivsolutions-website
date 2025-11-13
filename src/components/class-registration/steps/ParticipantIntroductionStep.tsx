import React, { useState, useEffect, useCallback, useRef } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';

interface Participant {
  id: string;
  name: string;
  location: string;
  wantToBuild: string;
  timestamp: number;
  color?: string;
}

const STICKY_NOTE_COLORS = [
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Sky Blue', value: '#93c5fd' },
  { name: 'Mint', value: '#6ee7b7' },
  { name: 'Peach', value: '#fed7aa' },
  { name: 'Lavender', value: '#c4b5fd' },
  { name: 'Coral', value: '#fda4af' },
  { name: 'Turquoise', value: '#5eead4' },
  { name: 'Lemon', value: '#fef9c3' },
  { name: 'Rose', value: '#fb7185' },
  { name: 'Periwinkle', value: '#a5b4fc' },
  { name: 'Sage', value: '#86efac' },
];

export const ParticipantIntroductionStep: React.FC = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [wantToBuild, setWantToBuild] = useState('');
  const [selectedColor, setSelectedColor] = useState(STICKY_NOTE_COLORS[0].value);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const INITIAL_LIMIT = 100; // Show more initially since we have real-time updates

  // Real-time Firestore listener
  useEffect(() => {
    const participantsRef = collection(db, 'workshop-participants');
    const q = query(
      participantsRef,
      orderBy('timestamp', 'desc'),
      limit(INITIAL_LIMIT)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const participantsList: Participant[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          participantsList.push({
            id: doc.id,
            name: data.name,
            location: data.location,
            wantToBuild: data.wantToBuild,
            timestamp: data.timestamp,
            color: data.color || '#fef08a',
          });
        });

        setParticipants(participantsList);
        setTotal(participantsList.length);
        setIsLoading(false);
        
        console.log('[ParticipantIntroductionStep] Real-time update:', participantsList.length, 'participants');
      },
      (error) => {
        console.error('[ParticipantIntroductionStep] Firestore listener error:', error);
        setIsLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!name.trim() || !location.trim() || !wantToBuild.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const participantsRef = collection(db, 'workshop-participants');
      await addDoc(participantsRef, {
        name: name.trim(),
        location: location.trim(),
        wantToBuild: wantToBuild.trim().substring(0, 100),
        timestamp: Date.now(),
        color: selectedColor,
      });

      // Clear form
      setName('');
      setLocation('');
      setWantToBuild('');
      setSelectedColor(STICKY_NOTE_COLORS[0].value); // Reset to default color

      console.log('[ParticipantIntroductionStep] Participant added successfully');
      
      // Scroll to top to show new entry (real-time listener will update the list)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error('[ParticipantIntroductionStep] Error adding participant:', error);
      alert('Failed to add participant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && name.trim() && location.trim() && wantToBuild.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAnonymousClick = () => {
    setName('Anonymous');
  };

  const handleRemove = async (id: string) => {
    try {
      const docRef = doc(db, 'workshop-participants', id);
      await deleteDoc(docRef);
      console.log('[ParticipantIntroductionStep] Participant removed successfully');
    } catch (error) {
      console.error('[ParticipantIntroductionStep] Error removing participant:', error);
      alert('Failed to remove participant. Please try again.');
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all participants?')) {
      return;
    }

    try {
      const participantsRef = collection(db, 'workshop-participants');
      const querySnapshot = await getDocs(participantsRef);
      const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('[ParticipantIntroductionStep] All participants cleared successfully');
    } catch (error) {
      console.error('Error clearing participants:', error);
      alert('Failed to clear participants. Please try again.');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch h-full">
      {/* Left Side: Form */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Your Turn! 👋
        </h2>
        
        <p className="text-base text-gray-300 mb-4">
          Add yourself to the board! Share your name, location, and what you want to build.
        </p>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="participant-name"
                className="block text-xs text-gray-400"
              >
                Your Name
              </label>
              <button
                type="button"
                onClick={handleAnonymousClick}
                className="text-xs text-gray-500 hover:text-gray-300 underline transition-colors"
              >
                Anonymous
              </button>
            </div>
            <input
              id="participant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label
              htmlFor="participant-location"
              className="block text-xs text-gray-400 mb-1"
            >
              Your Location
            </label>
            <input
              id="participant-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="City, State/Country"
            />
          </div>

          <div>
            <label
              htmlFor="participant-build"
              className="block text-xs text-gray-400 mb-1"
            >
              What do you want to build?
            </label>
            <textarea
              id="participant-build"
              value={wantToBuild}
              onChange={(e) => setWantToBuild(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              maxLength={100}
              rows={2}
              disabled={isSubmitting}
              className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="e.g., A SaaS app for small businesses..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {wantToBuild.length}/100 characters
            </p>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Sticky Note Color
            </label>
            <div className="flex gap-1.5 w-full">
              {STICKY_NOTE_COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-white scale-105'
                      : 'border-gray-600 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add to Board'}
          </button>
        </form>
      </div>

      {/* Right Side: Sticky Notes Board */}
      <div className="flex-1 w-full min-h-[400px]">
        <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-6 lg:p-8 min-h-full flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white">
              Our Workshop Participants
            </h3>
            {total > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {total} {total === 1 ? 'participant' : 'participants'}
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <p className="text-base">Loading participants...</p>
            </div>
          ) : participants.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-500">
              <p className="text-base">Be the first to add yourself to the board!</p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="overflow-y-auto overflow-x-visible pr-2"
              style={{
                maxHeight: 'calc(120px * 3 + 0.75rem * 2)', // Fits exactly 3 rows: 3 sticky notes × 120px height + 2 gaps × 0.75rem
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min p-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="relative group text-gray-900 p-3 rounded-lg shadow-lg transform rotate-[-2deg] hover:rotate-0 hover:scale-105 hover:z-10 transition-all duration-200 cursor-pointer h-[120px]"
                    style={{
                      backgroundColor: participant.color || '#fef08a',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => handleRemove(participant.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold hover:bg-red-600"
                      title="Remove"
                    >
                      ×
                    </button>

                    <div className="space-y-1.5">
                      <div className="font-bold text-base border-b-2 border-gray-400 pb-1 truncate" title={participant.name}>
                        {participant.name}
                      </div>
                      <div className="text-xs text-gray-700 truncate" title={participant.location}>
                        📍 {participant.location}
                      </div>
                      <div className="text-xs text-gray-800 pt-1 border-t border-gray-300 line-clamp-2">
                        <span className="font-semibold">Building:</span> {participant.wantToBuild}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
