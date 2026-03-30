import React, { useState, useEffect } from 'react';
import { db } from '../api/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
// Import the logic we built for optimized settlements 
import { calculateBalances, minimizeTransactions } from '../lib/settlement';
import AddExpenseForm from '../components/AddExpenseForm';
import SpendingInsights from '../components/SpendingInsights';
import { 
  LayoutDashboard, 
  Receipt, 
  ArrowRightLeft, 
  Moon, 
  Sun,
  ExternalLink 
} from 'lucide-react';
import { motion } from 'framer-motion';


const Dashboard = ({ groupId, members }) => {
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Real-time listener for instant updates across devices 
    const q = query(
      collection(db, "expenses"), 
      where("groupId", "==", groupId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
      
      const balances = calculateBalances(data, members);
      setSettlements(minimizeTransactions(balances));
    });

    return () => unsubscribe();
  }, [groupId, members]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark'); // Requirement: Dark Mode 🌙 
  };

  return (
    <div className="transition-colors duration-300">
      <header className="glass-nav">
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
              <LayoutDashboard size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Dashboard</div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                Group Overview
              </div>
            </div>
          </div>

          <button onClick={toggleDarkMode} className="btn-soft" type="button" aria-label="Toggle dark mode">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      <main className="container-page space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative overflow-hidden rounded-3xl p-8 text-white shadow-xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(139,92,246,1) 45%, rgba(236,72,153,1) 100%)',
              }}
            >
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/15 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

              <p className="text-sm font-semibold text-white/80">Total Group Spend</p>
              <h2 className="mt-1 text-4xl font-black tracking-tight">
                ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </h2>
              <p className="mt-3 text-xs font-semibold text-white/75">
                {expenses.length} expenses · {members?.length ?? 0} members
              </p>
            </motion.div>
          </div>
          <SpendingInsights expenses={expenses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-slate-900 dark:text-white">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <ArrowRightLeft size={18} />
                </span>
                Suggested Settlements
              </h3>
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-sm transition dark:border-white/10 dark:bg-slate-950/25"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {s.from} owes
                      </p>
                      <p className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        ₹{s.amount}
                      </p>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                        To {s.to}
                      </p>
                    </div>

                    {/* Requirement: One-Tap UPI Payment  */}
                    <a href={s.upiUrl} className="btn-primary shrink-0 px-4 py-2.5" target="_blank" rel="noreferrer">
                      Pay Now <ExternalLink size={14} />
                    </a>
                  </motion.div>
                ))}

                {settlements.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300/60 bg-white/40 p-6 text-center text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-slate-950/20 dark:text-slate-300">
                    No settlements yet. Add an expense to see who owes what.
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="lg:col-span-1">
            <AddExpenseForm groupId={groupId} members={members} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
