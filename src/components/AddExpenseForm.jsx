import React, { useState } from 'react';
import { suggestCategory } from '../lib/aiClassifier';
import { addExpense } from '../api/firestoreService';
import { PieChart, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

const AddExpenseForm = ({ groupId, members }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [customShares, setCustomShares] = useState({});

  const handleInputChange = (member, value) => {
    setCustomShares((prev) => ({ ...prev, [member]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupId) {
      toast.error('No group selected. Go back and open a group.');
      return;
    }
    if (!members?.length) {
      toast.error('This group has no members.');
      return;
    }

    const totalAmount = parseFloat(amount, 10);
    if (Number.isNaN(totalAmount) || totalAmount <= 0) {
      toast.error('Enter a valid amount.');
      return;
    }

    if (splitType === 'custom') {
      const enteredTotal = Object.values(customShares).reduce((a, b) => a + b, 0);
      if (Math.abs(enteredTotal - totalAmount) > 0.1) {
        toast.error(
          `Total split (₹${enteredTotal.toFixed(2)}) must equal expense amount (₹${totalAmount.toFixed(2)})`
        );
        return;
      }
    }

    const { name, icon } = suggestCategory(description);

    const expenseData = stripUndefined({
      description: description.trim(),
      amount: totalAmount,
      category: name,
      categoryIcon: icon,
      payerId: members[0],
      splitType,
      customShares: splitType === 'custom' ? customShares : null,
    });

    try {
      const docRef = await addExpense(groupId, expenseData);
      toast.success(`Expense saved (ID: ${docRef.id})`);
      setDescription('');
      setAmount('');
      setCustomShares({});
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Could not save expense. Check Firestore rules and your connection.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card card-hover space-y-4 p-6">
      <h3 className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <PieChart size={18} />
        </span>
        Split Expense
      </h3>

      <input
        className="input"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-400">₹</span>
        <input
          type="number"
          min="0"
          step="0.01"
          className="input w-full pl-10"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="flex rounded-2xl border border-slate-200/70 bg-white/60 p-1 shadow-sm dark:border-white/10 dark:bg-slate-950/25">
        <button
          type="button"
          onClick={() => setSplitType('equal')}
          className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition-all ${
            splitType === 'equal'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-white/10 dark:text-indigo-300'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          EQUAL
        </button>
        <button
          type="button"
          onClick={() => setSplitType('custom')}
          className={`flex-1 rounded-xl py-2 text-xs font-extrabold transition-all ${
            splitType === 'custom'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-white/10 dark:text-indigo-300'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          CUSTOM
        </button>
      </div>

      {splitType === 'custom' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          <p className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Info size={12} /> Enter exact amount for each
          </p>
          {members.map((member) => (
            <div key={member} className="flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{member}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="₹0"
                className="input w-28 px-3 py-2"
                onChange={(e) => handleInputChange(member, e.target.value)}
              />
            </div>
          ))}
        </motion.div>
      )}

      <button type="submit" className="btn-primary w-full py-3">
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenseForm;
