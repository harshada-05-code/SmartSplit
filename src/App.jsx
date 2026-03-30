import React, { useState } from 'react';

import GroupSelection from './pages/GroupSelection';
import Dashboard from './pages/Dashboard';
import { ArrowLeft, Sparkles } from 'lucide-react';

function App() {
  const [activeGroup, setActiveGroup] = useState(null);

  return (
    <main className="app-shell">
      {!activeGroup ? (
        <GroupSelection onSelectGroup={setActiveGroup} />
      ) : (
        <>
          <nav className="glass-nav">
            <div className="container-page flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">SmartSplit</div>
                  <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {activeGroup?.name}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveGroup(null)}
                className="btn-soft"
                type="button"
              >
                <ArrowLeft size={16} />
                Back to Groups
              </button>
            </div>
          </nav>
          <Dashboard groupId={activeGroup.id} members={activeGroup.members} />
        </>
      )}
    </main>
  );
}

export default App;
