import React from 'react';

export const WhyWorkshopStep2: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-8">
        AI changed that
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* BEFORE */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center h-[4.5rem]">
            <div className="text-2xl font-bold text-red-400 text-center">BEFORE</div>
            <div className="text-xl text-white text-center">Complex code</div>
          </div>
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6 font-mono text-xs text-green-400 overflow-hidden flex items-center" style={{ height: '300px' }}>
            <div className="space-y-1 opacity-70 w-full">
              <div>{'function createWebsite() {'}</div>
              <div className="pl-4">{'const server = require("express")();'}</div>
              <div className="pl-4">{'const db = new Database({'}</div>
              <div className="pl-8">{'host: "localhost",'}</div>
              <div className="pl-8">{'port: 5432,'}</div>
              <div className="pl-8">{'user: "admin",'}</div>
              <div className="pl-4">{'});'}</div>
              <div className="pl-4">{'server.get("/", (req, res) => {'}</div>
              <div className="pl-8">{'res.render("index", {'}</div>
              <div className="pl-12">{'data: fetchData()'}</div>
              <div className="pl-8">{'});'}</div>
              <div className="pl-4">{'});'}</div>
              <div>{'}'}</div>
            </div>
          </div>
          <p className="text-gray-400 text-center italic text-sm">Intimidating, right?</p>
        </div>

        {/* AFTER */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-center h-[4.5rem]">
            <div className="text-2xl font-bold text-green-400 text-center">AFTER</div>
            <div className="text-xl text-white text-center">Simple conversation</div>
          </div>
          <div className="bg-zinc-900 border border-gray-700 rounded-xl p-6 space-y-4 flex flex-col justify-center" style={{ height: '300px' }}>
            <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <p className="text-white text-base">
                "Build me a professional website with my bio, contact info, and a modern design"
              </p>
            </div>
            <div className="bg-gray-700/30 border border-gray-600/30 rounded-lg p-4">
              <p className="text-gray-300 text-base">
                ✓ I'll create that for you right away...
              </p>
            </div>
            <div className="text-center text-green-400 font-semibold text-lg">
              → Website built in minutes
            </div>
          </div>
          <p className="text-gray-400 text-center italic text-sm">That's it. Really.</p>
        </div>
      </div>
    </div>
  );
};

