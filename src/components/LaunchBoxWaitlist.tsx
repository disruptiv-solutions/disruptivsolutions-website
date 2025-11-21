'use client';

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { trackFormSubmission, trackButtonClick } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const LaunchboxWaitlist: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasWaitlistAccess, setHasWaitlistAccess] = useState<boolean | null>(null);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);

  // Check if user is already on the waitlist (only for authenticated users)
  useEffect(() => {
    const checkWaitlistAccess = async () => {
      if (!user) {
        // No user signed in - show the form
        setHasWaitlistAccess(false);
        setIsLoadingAccess(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          // Only show "You're In" page if user is signed in AND has waitlist access
          setHasWaitlistAccess(userData.launchboxWaitlist === true);

          // Pre-fill form if user doesn't have waitlist access yet
          if (userData.launchboxWaitlist !== true) {
            setName(userData.name || user.displayName || '');
            setEmail(userData.email || user.email || '');
            setPhone(userData.phone || '');
            setSubscribeNewsletter(userData.newsletter || false);
          }
        } else {
          setHasWaitlistAccess(false);
          // Pre-fill form with auth user data
          setName(user.displayName || '');
          setEmail(user.email || '');
        }
      } catch (error) {
        console.error('Error checking waitlist access:', error);
        setHasWaitlistAccess(false);
      } finally {
        setIsLoadingAccess(false);
      }
    };

    checkWaitlistAccess();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email) {
      setSubmitError('Please fill in your name and email.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const webhookData = {
      name,
      email,
      phone: phone || 'N/A',
      subscribeNewsletter,
      listType: 'launchbox_founding_member_waitlist',
      timestamp: new Date().toISOString(),
    };

    try {
      console.log('[LaunchboxWaitlist] Form submission started');
      console.log('[LaunchboxWaitlist] Sending webhook data:', webhookData);

      const response = await fetch('/api/waitlist-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('[LaunchboxWaitlist] API response status:', response.status);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to join waitlist. Please try again.' }));
        throw new Error(errorData.error || 'Failed to join waitlist. Please try again.');
      }

      console.log('[LaunchboxWaitlist] Webhook success');

      // Track waitlist signup
      console.log('[LaunchboxWaitlist] Tracking analytics event');
      trackFormSubmission('waitlist_signup', {
        with_newsletter: subscribeNewsletter,
        page_location: '/waitlist',
        list_type: 'launchbox_founding_member_waitlist',
      });

      // If newsletter checkbox is checked, also submit to newsletter webhook
      if (subscribeNewsletter) {
        console.log('[LaunchboxWaitlist] Also sending to newsletter webhook');
        try {
          const newsletterResponse = await fetch('/api/newsletter-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          });
          console.log(
            '[LaunchboxWaitlist] Newsletter webhook response:',
            newsletterResponse.status,
          );
          // We don't fail the whole submission if newsletter signup fails
        } catch (newsletterError) {
          console.error('[LaunchboxWaitlist] Newsletter signup error:', newsletterError);
        }
      }

      // If user is signed in, update their Firestore profile to set launchboxWaitlist: true
      if (user) {
        try {
          await setDoc(
            doc(db, 'users', user.uid),
            {
              name: name || user.displayName,
              email: email || user.email,
              phone: phone || null,
              newsletter: subscribeNewsletter,
              launchboxWaitlist: true,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          );
          // Also add to waitlist collection for admin tracking
          if (email || user.email) {
            const waitlistRef = doc(db, 'waitlist', email || user.email || 'unknown');
            await setDoc(
              waitlistRef,
              {
                name: name || user.displayName,
                email: email || user.email,
                phone: phone || null,
                newsletter: subscribeNewsletter,
                userId: user.uid,
                createdAt: serverTimestamp(),
              },
              { merge: true },
            );
          }
          setHasWaitlistAccess(true);
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (isLoadingAccess) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-white flex items-center justify-center pt-[65px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </>
    );
  }

  // Show confirmation page if user is already on waitlist or after successful submission
  if (hasWaitlistAccess || submitSuccess) {
    return (
      <>
        <Navigation />
        <section className="min-h-screen pt-[65px] px-6 py-12 lg:py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
                You&apos;re In. Welcome to the Launchbox Founding Member List.
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-4">
                Thanks for raising your hand.
              </p>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                You&apos;re now officially on the list for early access, founding-member
                pricing, and behind-the-scenes updates as I build Launchbox.
              </p>
            </div>

            {/* What Happens Next */}
            <div className="mb-16 bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                What happens next:
              </h2>
              <ul className="space-y-4 text-base text-gray-700">
                <li>• I&apos;ll send you updates as I ship new pieces of the platform.</li>
                <li>• You&apos;ll be among the first invited into the private beta.</li>
                <li>
                  • When I launch paid plans, you&apos;ll get access to the lowest pricing
                  I&apos;ll ever offer.
                </li>
              </ul>
              <p className="text-base text-gray-600 mt-6">
                For now, keep this page handy — it&apos;s your quick overview of what
                Launchbox is and what you&apos;ll be able to do with it.
              </p>
            </div>

            {/* What Is Launchbox? */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                What Is Launchbox?
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Launchbox is an all-in-one hub for creators, coaches, and founders to teach,
                build, and sell AI-powered products — without hiring a dev team or duct-taping
                a bunch of tools together.
              </p>
              <p className="text-base text-gray-600 mb-4">
                Instead of bouncing between platforms, Launchbox is meant to be your:
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-6 italic">
                &quot;AI command center&quot; for your audience and your offers.
              </p>
              <p className="text-base text-gray-600 mb-4">
                Inside Launchbox, you&apos;ll be able to:
              </p>
              <ul className="space-y-3 text-base text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span>📚</span>
                  <span>Host courses, workshops, and trainings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🧰</span>
                  <span>
                    Offer AI tools (chatbots, generators, utilities, workflows) to your
                    students and clients
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>💬</span>
                  <span>Run your community in the same space</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>💸</span>
                  <span>
                    Sell access via subscriptions, one-time purchases, and bundles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🎨</span>
                  <span>
                    Make it feel like your world — your branding, your language, your way of
                    teaching
                  </span>
                </li>
              </ul>
            </div>

            {/* Who Launchbox Is For */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Who Launchbox Is For
              </h2>
              <p className="text-base text-gray-600 mb-4">
                Launchbox is especially built for people who think:
              </p>
              <p className="text-lg font-semibold text-gray-800 mb-6 italic">
                &quot;I have expertise and ideas… I just don&apos;t want to fight with tech
                all day.&quot;
              </p>
              <p className="text-base text-gray-600 mb-4">It&apos;s a fit if you&apos;re:</p>
              <ul className="space-y-4 text-base text-gray-600 mb-6">
                <li>
                  <strong className="text-black">A coach or consultant</strong>
                  <br />
                  You want a home for your programs and AI tools that your clients can actually
                  use between calls.
                </li>
                <li>
                  <strong className="text-black">A course creator or teacher</strong>
                  <br />
                  You&apos;re tired of static videos and want interactive, AI-powered
                  experiences that feel like a product — not a playlist.
                </li>
                <li>
                  <strong className="text-black">A community builder</strong>
                  <br />
                  You run a group (FB, Discord, Circle, etc.) and want one central hub where
                  people can learn, use tools, and stay engaged.
                </li>
                <li>
                  <strong className="text-black">A founder / expert / niche pro</strong>
                  <br />
                  You&apos;ve got frameworks and IP that could become AI tools, assistants, or
                  micro-products — but you don&apos;t want to code everything from scratch.
                </li>
              </ul>
            </div>

            {/* What You'll Be Able To Do Inside Launchbox */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                What You&apos;ll Be Able To Do Inside Launchbox
              </h2>
              <p className="text-base text-gray-600 mb-6">
                Here&apos;s the kind of stuff I&apos;m designing Launchbox to handle right
                out of the box:
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    1. Launch AI-Powered Offers Fast
                  </h3>
                  <ul className="space-y-2 text-base text-gray-600 ml-4">
                    <li>• Spin up spaces for different programs or audiences</li>
                    <li>• Attach AI tools (chatbots, generators, workflows) to each space</li>
                    <li>• Package those into offers:</li>
                    <li className="ml-8">- Free lead magnets</li>
                    <li className="ml-8">- Low-ticket tools</li>
                    <li className="ml-8">- High-ticket programs with tools included</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    2. Teach + Tools in One Place
                  </h3>
                  <ul className="space-y-2 text-base text-gray-600 ml-4">
                    <li>• Host your lessons, slides, and replays</li>
                    <li>• Drop in AI components that help students apply what they&apos;re learning</li>
                    <li>
                      • Turn your frameworks into guided prompts and assistants people can reuse
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    3. Make It Feel Like Your Platform
                  </h3>
                  <ul className="space-y-2 text-base text-gray-600 ml-4">
                    <li>• Custom branding (name, logo, colors, copy)</li>
                    <li>
                      • Your subdomain so it feels like your own space, not just &quot;another
                      tool&quot;
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-black mb-3">
                    4. Monetize Without Wrestling Stripe All Day
                  </h3>
                  <ul className="space-y-2 text-base text-gray-600 ml-4">
                    <li>• Subscription plans, one-time offers, and bundles</li>
                    <li>
                      • Usage handled under the hood so you don&apos;t have to sweat every API
                      call
                    </li>
                    <li>
                      • Clear dashboards so you can see who&apos;s active and what they&apos;re
                      actually using
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Where Things Are Right Now */}
            <div className="mb-16 bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                Where Things Are Right Now
              </h2>
              <p className="text-base text-gray-600 mb-6">
                I want you to know exactly what you raised your hand for.
              </p>
              <p className="text-base text-gray-700 mb-4 font-semibold">
                Right now I&apos;m actively:
              </p>
              <ul className="space-y-3 text-base text-gray-600">
                <li>• Polishing the member experience for lessons, spaces, and tools</li>
                <li>• Tightening up billing so paid plans are simple and predictable</li>
                <li>
                  • Running live workshops (like the one you came from) to pressure-test the
                  &quot;teaching + tools&quot; flow in real time
                </li>
                <li>
                  • Collecting feedback from early testers to decide what ships in v1 versus
                  later
                </li>
              </ul>
              <p className="text-base text-gray-700 mt-6">
                As a founding member, you&apos;re not just on a list — you&apos;re helping
                shape how this thing works.
              </p>
            </div>

            {/* What "Founding Member" Actually Means */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                What &quot;Founding Member&quot; Actually Means
              </h2>
              <p className="text-base text-gray-600 mb-4">
                Being on this list gets you:
              </p>
              <ul className="space-y-3 text-base text-gray-600 mb-6">
                <li className="flex items-start gap-2">
                  <span>🧪</span>
                  <span>Private beta invites before I open anything publicly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🏷️</span>
                  <span>Founding-member pricing (lowest it will ever be)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🧭</span>
                  <span>
                    Input on features &amp; direction — your use cases matter a lot at this
                    stage
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🎁</span>
                  <span>Priority for things like:</span>
                </li>
                <li className="ml-8 space-y-2">
                  <div className="text-base text-gray-600">- Done-with-you setup</div>
                  <div className="text-base text-gray-600">
                    - Migration help from your current tools
                  </div>
                  <div className="text-base text-gray-600">
                    - Early access to new programs, tools, and experiments
                  </div>
                </li>
              </ul>
              <p className="text-base text-gray-600">Again: you haven&apos;t paid anything.</p>
              <p className="text-base text-gray-700 font-semibold mt-2">
                This just tells me, &quot;Yes, Ian, I want to be early.&quot;
              </p>
            </div>

            {/* What To Do While You Wait */}
            <div className="mb-16 bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                What To Do While You Wait
              </h2>
              <p className="text-base text-gray-600 mb-6">
                A few ways to get the most out of this in the meantime:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Check your email
                  </h3>
                  <p className="text-base text-gray-600">
                    I&apos;ll send updates, timelines, and early beta details to the address
                    you used here.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Make a quick list
                  </h3>
                  <p className="text-base text-gray-600 mb-2">Jot down:</p>
                  <ul className="space-y-1 text-base text-gray-600 ml-4">
                    <li>• The offers you already have</li>
                    <li>• The AI tools or experiences you wish existed for your people</li>
                    <li>• Any current platforms you&apos;d love to get out of</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Stay plugged in
                  </h3>
                  <ul className="space-y-1 text-base text-gray-600 ml-4">
                    <li>
                      • Join my free Facebook group:{' '}
                      <a
                        href="https://www.facebook.com/groups/2000295250823114"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 underline"
                      >
                        here
                      </a>
                    </li>
                    <li>• Watch for new free workshops and demos</li>
                  </ul>
                  <p className="text-base text-gray-600 mt-2">
                    The clearer you are on what you want Launchbox to do for you, the more I
                    can tailor it to real use cases like yours.
                  </p>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="text-center text-gray-600">
              <p className="text-lg font-semibold text-black mb-2">
                Questions? Ideas? Edge-case dreams?
              </p>
              <p className="mb-2">
                Hit reply to any email I send you, or message me directly at{' '}
                <a
                  href="mailto:ian@ianmcdonald.ai"
                  className="text-red-600 hover:text-red-700 underline"
                >
                  ian@ianmcdonald.ai
                </a>
                .
              </p>
              <p className="text-base text-gray-700 font-medium">
                I&apos;m building Launchbox for people like you — your questions and wild
                ideas are welcome.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Show form page before submission
  return (
    <>
      <Navigation />
      <section className="min-h-screen pt-[65px] px-6 py-12 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
              Join the Launchbox Founding Member List
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-4">
              An all-in-one hub for creators, coaches, and founders to teach, build, and sell
              AI-powered products — without needing to code.
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Raise your hand early, lock in founding-member pricing, and get first access when
              Launchbox goes live.
            </p>
            <p className="text-sm text-gray-500">
              No payment today. This just tells me you want to be first in line when I open the
              doors.
            </p>
          </div>

          {/* What Is Launchbox? */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              What Is Launchbox?
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Launchbox is your &quot;AI command center&quot; for your business.
            </p>
            <p className="text-base text-gray-600 mb-4">
              Instead of juggling 10 different tools, Launchbox is where you can:
            </p>
            <ul className="space-y-3 text-base text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span>📚</span>
                <span>Host courses, workshops, and trainings</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🧰</span>
                <span>Offer AI tools to your audience (chatbots, generators, utilities, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💬</span>
                <span>Run your community in one place</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💸</span>
                <span>Sell access with subscriptions, one-time offers, and bundles</span>
              </li>
              <li className="flex items-start gap-2">
                <span>⚙️</span>
                <span>Customize the experience to match your brand and the way you teach</span>
              </li>
            </ul>
            <p className="text-base text-gray-600">
              It&apos;s built for non-technical founders who want the power of AI apps without
              hiring a dev team or duct-taping a bunch of platforms together.
            </p>
          </div>

          {/* Who Launchbox Is For */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Who Launchbox Is For
            </h2>
            <p className="text-base text-gray-600 mb-4">
              Launchbox is especially for you if you&apos;re:
            </p>
            <ul className="space-y-3 text-base text-gray-600 mb-6">
              <li>• A coach / consultant who wants to bundle AI tools with your programs</li>
              <li>
                • A course creator who wants interactive, AI-powered learning instead of static
                videos
              </li>
              <li>
                • A community builder who wants one home base for content, tools, and people
              </li>
              <li>
                • A founder / expert with frameworks or IP that could become AI-powered products
              </li>
            </ul>
            <p className="text-base text-gray-600">
              If you&apos;ve ever thought, &quot;I wish I had my own AI platform for my
              people,&quot; that&apos;s Launchbox.
            </p>
          </div>

          {/* What You Get As a Founding Member */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              What You Get As a Founding Member
            </h2>
            <p className="text-base text-gray-600 mb-4">
              By joining the founding-member list:
            </p>
            <ul className="space-y-3 text-base text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span>🧪</span>
                <span>Behind-the-scenes updates as I build and ship features</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🚀</span>
                <span>First invite when the private beta opens</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🏷️</span>
                <span>Lowest founding-member pricing I&apos;ll ever offer</span>
              </li>
              <li className="flex items-start gap-2">
                <span>💬</span>
                <span>Opportunities to shape the product with feedback and feature input</span>
              </li>
            </ul>
            <p className="text-base text-gray-600">
              Again: no payment today — this just raises your hand so I know you want in early.
            </p>
          </div>

          {/* Founding Member Form */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Founding Member Form
            </h2>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-black mb-6">Your Information</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-black"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone (optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none text-black"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-red-600"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-700">
                    I&apos;d also like to get Ian&apos;s newsletter with AI app-building tips &
                    workshop invites
                  </label>
                </div>

                {submitError && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <p className="text-red-700 font-medium">{submitError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (!isSubmitting) {
                      trackButtonClick('join_waitlist', 'waitlist_page');
                    }
                  }}
                  className="w-full px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all disabled:opacity-60 text-lg"
                >
                  {isSubmitting ? 'Joining...' : 'Join the Founding Member List'}
                </button>

                <p className="text-xs text-gray-500 mt-6">
                  Short version: by joining, you&apos;ll be notified about Launchbox&apos;s
                  private beta, launch timeline, and founding-member pricing.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  By submitting this form, you agree to our{' '}
                  <a
                    href="/privacy"
                    className="text-red-600 hover:text-red-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>{' '}
                  and consent to being contacted about Launchbox and related offerings.
                </p>
              </form>
            </div>
          </div>

          {/* Questions */}
          <div className="text-center text-gray-600">
            <p>
              Questions? Email me at{' '}
              <a
                href="mailto:ian@ianmcdonald.ai"
                className="text-red-600 hover:text-red-700 underline"
              >
                ian@ianmcdonald.ai
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LaunchboxWaitlist;
