import React, { useState } from 'react';
import { suggestCategory } from '../lib/aiClassifier';
import { addExpense } from '../api/firestoreService';
import { Users, IndianRupee, PieChart, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const AddExpenseForm = ({ groupId, members }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'
  const [customShares, setCustomShares] = useState({}); // Stores { memberName: amount }

  const handleInputChange = (member, value) => {
    setCustomShares({ ...customShares, [member]: parseFloat(value) || 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    
    // Validation for Custom Split
    if (splitType === 'custom') {
      const enteredTotal = Object.values(customShares).reduce((a, b) => a + b, 0);
      if (Math.abs(enteredTotal - totalAmount) > 0.1) {
        return toast.error(`Total split (₹${enteredTotal}) must equal expense amount (₹${totalAmount})`);
      }
    }

    const { name, icon } = suggestCategory(description);

    const expenseData = {
      description,
      amount: totalAmount,
      category: name,
      categoryIcon: icon,
      payerId: members[0], // We assume the first member is the payer
      splitType,
      customShares: splitType === 'custom' ? customShares : null,
      timestamp: new Date()
    };

    await addExpense(groupId, expenseData);
    toast.success('Expense added!');
    setDescription('');
    setAmount('');
    setCustomShares({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
      <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
        size={18} className="text-indigo-500"/> Split Expense
      </h3>

      <input 
        className="w-full p-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">₹</span>
        <input 
          type="number"
          className="w-full p-3 pl-8 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      {/* Split Type Toggle */}
      <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
        <button 
          type="button"
          onClick={() => setSplitType('equal')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${splitType === 'equal' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}
        > EQUAL </button>
        <button 
          type="button"
          onClick={() => setSplitType('custom')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${splitType === 'custom' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`}
        > CUSTOM </button>
      </div>

      {/* Custom Inputs Rendering */}
      {splitType === 'custom' && (
        <div className="space-y-2 animate-in fade-in zoom-in duration-300">
          <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1">
            <Info size={12}/> Enter exact amount for each
          </p>
          {members.map(member => (
            <div key={member} className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">{member}</span>
              <input 
                type="number"
                placeholder="₹0"
                className="w-24 p-2 bg-gray-50 dark:bg-gray-900 border rounded-xl text-sm dark:border-gray-700 dark:text-white"
                onChange={(e) => handleInputChange(member, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenseForm;
