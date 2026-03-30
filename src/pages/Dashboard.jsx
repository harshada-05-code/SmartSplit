import React, { useState, useEffect } from 'react';
import { db } from '../api/firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { calculateBalances, minimizeTransactions } from '../lib/settlement';
import AddExpenseForm from '../components/AddExpenseForm';
import SpendingInsights from '../components/SpendingInsights';
import { 
  LayoutDashboard, 
  Receipt, 
  ArrowRightLeft, 
  TrendingUp, 
  Moon, 
  Sun,
  ExternalLink 
} from 'lucide-react';

const Dashboard = ({ groupId, members }) => {
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 4. Real-Time Updates: Listen for changes in Firestore [cite: 9, 37]
    const q = query(
      collection(db, "expenses"), 
      where("groupId", "==", groupId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
      
      // 1. Smart Settlement: Calculate optimized debts [cite: 18, 19]
      const balances = calculateBalances(data, members);
      setSettlements(minimizeTransactions(balances));
    });

    return () => unsubscribe();
  }, [groupId, members]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark'); // 13. Dark Mode 
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 pb-10">
      {/* Header with Dark Mode Toggle */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <LayoutDashboard size={24} /> SmartSplit
          </h1>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all hover:scale-110"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* 2. Clear Balance Dashboard (Visual Stats) [cite: 10, 18] */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-xl">
              <p className="text-indigo-100 text-sm font-medium">Total Group Spend</p>
              <h2 className="text-4xl font-black mt-1">
                ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
              </h2>
              <div className="mt-4 flex gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {expenses.length} Expenses Total
                </span>
              </div>
            </div>
          </div>
          
          {/* 6. Spending Insights (Pie Chart Component) [cite: 26, 39] */}
          <SpendingInsights expenses={expenses} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Smart Settlement List [cite: 19] */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <ArrowRightLeft className="text-indigo-500" size={20} /> Suggested Settlements
              </h3>
              <div className="space-y-3">
                {settlements.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 group transition-all hover:border-indigo-300">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">{s.from} owes</p>
                      <p className="text-xl font-black text-gray-800 dark:text-white">₹{s.amount}</p>
                      <p className="text-xs text-indigo-500 font-medium">To {s.to}</p>
                    </div>
                    {/* 8. One-Tap UPI Payment Button  */}
                    <a 
                      href={s.upiUrl}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
                    >
                      Pay Now <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Expenses List */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Receipt className="text-indigo-500" size={20} /> Recent Activity
              </h3>
              <div className="space-y-4">
                {expenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between items-center py-3 border-b dark:border-gray-700 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xl">
                        {exp.categoryIcon || '📦'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">{exp.description}</p>
                        <p className="text-xs text-gray-400 capitalize">Paid by {exp.payerId}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900 dark:text-white text-lg">₹{exp.amount}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* 3. Add Expense Form (Sidebar) [cite: 7, 17] */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AddExpenseForm groupId={groupId} members={members} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
