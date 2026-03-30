import React, { useState, useEffect } from 'react';
import { createGroup } from "../api/firestoreService";
import { db } from "../api/firebase"; // Direct import from the config file
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Users, Plus, ArrowRight, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
    if (!newGroupName?.trim() || members.length === 0) return;
    try {
      const docRef = await createGroup(newGroupName, members);
      toast.success('Group saved to Firebase');
      onSelectGroup({ id: docRef.id, name: newGroupName.trim(), members });
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Could not create group. Check Firestore rules and .env.');
    }
  };

  return (
    <div className="container-page max-w-2xl space-y-8">
      <header className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
        >
          <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
          Split expenses. Settle instantly. Stay friends.
        </motion.div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Welcome to <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">SmartSplit</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Select a group or create a new one to start splitting.
        </p>
      </header>

      {/* Create New Group Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="card card-hover p-6"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Plus size={18} />
          </span>
          Create New Group
        </h2>
        <div className="space-y-4">
          <input 
            className="input"
            placeholder="Group Name (e.g., Goa Trip 2026)"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
          />
          
          <div className="flex gap-2">
            <input 
              className="input flex-1"
              placeholder="Add Member Name"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMember()}
            />
            <button onClick={addMember} type="button" className="btn-soft px-3">
              <UserPlus size={20} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {members.map((m, i) => (
              <span key={i} className="badge">
                {m}
              </span>
            ))}
          </div>

          <button 
            onClick={handleCreate}
            disabled={!newGroupName || members.length === 0}
            className="btn-primary w-full py-3"
            type="button"
          >
            Start Splitting
          </button>
        </div>
      </motion.div>

      {/* Existing Groups List */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your Groups</h3>
        {groups.map(group => (
          <motion.button
            key={group.id}
            onClick={() => onSelectGroup(group)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="card card-hover group w-full p-4 text-left"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-pink-500/10 text-indigo-600 dark:text-indigo-300">
                <Users size={24} />
              </div>
              <div className="text-left">
                <p className="font-extrabold text-slate-900 dark:text-white">{group.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{group.members?.length} members</p>
              </div>
            </div>
            <ArrowRight className="text-slate-300 transition-colors group-hover:text-indigo-500 dark:text-slate-600 dark:group-hover:text-indigo-300" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default GroupSelection;