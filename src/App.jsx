import React, { useState } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import GroupSelection from './pages/GroupSelection';
import Dashboard from './pages/Dashboard';

function App() {
  const [activeGroup, setActiveGroup] = useState(null);

  return (
    <main className="min-h-screen bg-gray-50">
      {!activeGroup ? (
        <GroupSelection onSelectGroup={setActiveGroup} />
      ) : (
        <>
          <nav className="p-4 bg-white border-b flex justify-between items-center">
            <span className="font-bold text-primary text-xl">CivicSplit</span>
            <button 
              onClick={() => setActiveGroup(null)}
              className="text-sm text-gray-500 hover:text-primary"
            >
              Back to Groups
            </button>
          </nav>
          <Dashboard groupId={activeGroup.id} members={activeGroup.members} />
        </>
      )}
    </main>
  );
}

export default App;
