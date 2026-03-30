import React, { useState, useEffect } from 'react';
import { subscribeToExpenses } from '../api/firestoreService';
import AddExpenseForm from '../components/AddExpenseForm';
import { calculateBalances, minimizeTransactions } from '../lib/settlement';
import { LayoutDashboard, Receipt, ArrowRightLeft, TrendingUp } from 'lucide-react';

document.documentElement.classList.toggle('dark')

const Dashboard = ({ groupId, members }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    // Real-time listener for the "Real-Time Performance" requirement
    const unsubscribe = subscribeToExpenses(groupId, (data) => {
      setExpenses(data);
      const newBalances = calculateBalances(data, members);
      setBalances(newBalances);
      setSettlements(minimizeTransactions(newBalances));
    });

    return () => unsubscribe();
  }, [groupId, members]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Stat Cards */}
      <div className="bg-primary p-6 pb-24 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard /> SmartSplit Dashboard
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 space-y-6">
        {/* 1. Quick Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Total Group Spend</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              ₹{expenses.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 text-gray-500 mb-2">
              <ArrowRightLeft size={20} />
              <span className="text-sm font-medium">Pending Settlements</span>
            </div>
            <h2 className="text-3xl font-bold text-indigo-600">{settlements.length}</h2>
          </div>
        </div>

        {/* 2. Settlement Logic (Who owes whom) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ArrowRightLeft className="text-primary" size={18}/> Suggested Settlements
          </h3>
          <div className="space-y-3">
            {settlements.length > 0 ? settlements.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-medium text-gray-700">{s.from}</span>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-400">pays</span>
                  <div className="h-px w-12 bg-gray-300 my-1"></div>
                  <span className="text-primary font-bold">₹{s.amount}</span>
                </div>
                <span className="font-medium text-gray-700">{s.to}</span>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-4 italic">Everyone is settled up! 🎉</p>
            )}
          </div>
        </div>

        {/* 3. Add Expense & Recent History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
             <AddExpenseForm groupId={groupId} members={members} />
          </div>
          
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Receipt className="text-primary" size={18}/> Recent Expenses
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {expenses.map((exp) => (
                <div key={exp.id} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-800">{exp.description}</p>
                    <p className="text-xs text-gray-400 capitalize">{exp.category} • Paid by {exp.payerId}</p>
                  </div>
                  <p className="font-bold text-gray-900">₹{exp.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

