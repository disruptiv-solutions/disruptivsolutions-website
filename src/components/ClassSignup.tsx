'use client';

import React, { useState } from 'react';
import Navigation from './Navigation';

interface Session {
  id: string;
  date: string;
  time: string;
  timestamp: string; // ISO format for date comparison
}

const ClassSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sessions: Session[] = [
    {
      id: 'nov13',
      date: 'Monday, Nov 13',
      time: '12:00 PM EST',
      timestamp: '2024-11-13T12:00:00-05:00'
    },
    {
      id: 'nov18',
      date: 'Saturday, Nov 18',
      time: '12:00 PM EST',
      timestamp: '2024-11-18T12:00:00-05:00'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedSession) {
      alert('Please fill in all required fields and select a session.');
      return;
    }

    setIsSubmitting(true);

    const selectedSessionData = sessions.find(s => s.id === selectedSession);
    const sessionInfo = selectedSessionData 
      ? `${selectedSessionData.date} at ${selectedSessionData.time}`
      : '';

    const subject = encodeURIComponent('Free AI App Building Class Signup');
    const body = encodeURIComponent(
      `Free AI App Building Class Signup\n\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'N/A'}\n` +
      `Selected Session: ${sessionInfo}\n`
    );

    const mailtoLink = `mailto:ian@ianmcdonald.me?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;

    // Reset form after a short delay
    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setPhone('');
      setSelectedSession('');
    }, 1000);
  };

  return (
    <>
      <Navigation />
      <section className="min-h-screen pt-[65px] px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Free AI App Building Class
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Live session on shipping your first working AI app. Free • 1 hour.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-zinc-900/60 rounded-2xl border border-gray-800 p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Your Information</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
                    Phone <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>

              {/* Session Selection */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Select a Session <span className="text-red-500">*</span>
                </h2>
                
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <label
                      key={session.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedSession === session.id
                          ? 'bg-red-900/20 border-red-600'
                          : 'bg-white/5 border-gray-700 hover:bg-white/10 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="session"
                        value={session.id}
                        checked={selectedSession === session.id}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        required
                        className="w-5 h-5 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium text-lg">{session.date}</p>
                          <p className="text-sm text-gray-400">{session.time}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Up for Free Class'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  By signing up, you'll receive a confirmation email with the Zoom link and class details.
                </p>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center text-gray-400">
            <p className="mb-2">Questions? Email us at</p>
            <a 
              href="mailto:ian@ianmcdonald.me" 
              className="text-red-500 hover:text-red-400 underline"
            >
              ian@ianmcdonald.me
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClassSignup;

