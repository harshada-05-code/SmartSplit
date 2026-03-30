import React, { useState, useEffect } from 'react';
import { createGroup } from "../api/firestoreService";
import { db } from "../api/firebase"; // Direct import from the config file
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Users, Plus, ArrowRight, UserPlus } from 'lucide-react';

const GroupSelection = ({ onSelectGroup }) => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "groups"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      setGroups(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const addMember = () => {
    if (memberInput.trim()) {
      setMembers([...members, memberInput.trim()]);
      setMemberInput('');
    }
  };

  const handleCreate = async () => {
    if (newGroupName && members.length > 0) {
      const docRef = await createGroup(newGroupName, members);
      onSelectGroup({ id: docRef.id, name: newGroupName, members });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to SmartSplit</h1>
        <p className="text-gray-500 mt-2">Select a group or create a new one to start splitting</p>
      </header>

      {/* Create New Group Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="text-primary" /> Create New Group
        </h2>
        <div className="space-y-4">
          <input 
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Group Name (e.g., Goa Trip 2026)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          
          <div className="flex gap-2">
            <input 
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Add Member Name"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
            />
            <button onClick={addMember} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200">
              <UserPlus size={20} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {members.map((m, i) => (
              <span key={i} className="bg-indigo-50 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {m}
              </span>
            ))}
          </div>

          <button 
            onClick={handleCreate}
            disabled={!newGroupName || members.length === 0}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            Start Splitting
          </button>
        </div>
      </div>

      {/* Existing Groups List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Your Groups</h3>
        {groups.map(group => (
          <button 
            key={group.id}
            onClick={() => onSelectGroup(group)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg text-primary">
                <Users size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">{group.name}</p>
                <p className="text-xs text-gray-400">{group.members?.length} members</p>
              </div>
            </div>
            <ArrowRight className="text-gray-300 group-hover:text-primary transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroupSelection;