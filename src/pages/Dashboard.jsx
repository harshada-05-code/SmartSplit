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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <LayoutDashboard size={24} /> SmartSplit
          </h1>
          <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl">
              <p className="text-indigo-100 text-sm">Total Group Spend</p>
              <h2 className="text-4xl font-black mt-1">
                ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </h2>
            </div>
          </div>
          <SpendingInsights expenses={expenses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border dark:border-gray-700">
              <h3 className="text-lg font-bold mb-4 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="text-indigo-500" size={20} /> Suggested Settlements
              </h3>
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">{s.from} owes</p>
                      <p className="text-xl font-black text-gray-800 dark:text-white">₹{s.amount}</p>
                      <p className="text-xs text-indigo-500 font-medium">To {s.to}</p>
                    </div>
                    {/* Requirement: One-Tap UPI Payment  */}
                    <a href={s.upiUrl} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                      Pay Now <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
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
