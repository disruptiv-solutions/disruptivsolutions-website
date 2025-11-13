import React from 'react';

export const AIBasicsStep: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300 leading-relaxed">
      <h2 className="text-2xl font-bold text-white">
        The "Magic": AI & App Dev Basics
      </h2>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          The "Old Way" (Traditional Development)
        </h3>
        <p>
          Normally, to build a website, you'd have to write hundreds
          of lines of code in languages like HTML, CSS, and
          JavaScript. You'd also need to learn frameworks, databases,
          and how to set up a server. It's powerful, but has a very
          steep learning curve.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          The "New Way" (AI-Powered Development)
        </h3>
        <p>
          Today, we're using a new approach. We will use AI to{' '}
          <strong>be</strong> our developer. We'll describe{' '}
          <strong>what</strong> we want in plain English (our
          "prompt"), and an AI platform like{' '}
          <strong>Lovable's app building platform</strong> will write all that complex
          code <strong>for</strong> us.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">
          What We Are (and Aren't) Building
        </h3>
        <p>
          Our site today is a simple "static" site—it just displays
          information. More complex apps might need a{' '}
          <strong>database</strong> (to store user signups) or{' '}
          <strong>authentication</strong> (to let users log in). We
          aren't doing that today, but it's good to know those are the
          "next steps" in app development.
        </p>
      </div>
    </div>
  );
};

