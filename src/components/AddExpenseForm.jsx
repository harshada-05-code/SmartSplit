import React, { useState } from 'react';
import { suggestCategory } from '../lib/aiClassifier'; // We'll create this next
import { addExpense } from '../api/firestoreService';
import { Tag, IndianRupee, MessageSquare } from 'lucide-react';

const AddExpenseForm = ({ groupId, members }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState(members[0]);
  const [category, setCategory] = useState('others');

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);
    // AI Trigger: Suggest category as user types
    setCategory(suggestCategory(val)); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      description,
      amount: parseFloat(amount),
      payerId: payer,
      category,
      splitType: 'equal', // Defaulting to equal for the MVP
    };
    await addExpense(groupId, expenseData);
    // Reset form or show success toast
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Expense</h3>
      
      <div className="space-y-4">
        {/* Description Input */}
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input 
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="What was this for? (e.g. Dinner, Rent)"
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>

        {/* Amount Input */}
        <div className="relative">
          <IndianRupee className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
          <input 
            type="number"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Category Badge (AI Suggested) */}
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-indigo-100 text-primary capitalize">
            Category: {category}
          </span>
        </div>

        <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all">
          Add Expense
        </button>
      </div>
    </form>
  );
};

export default AddExpenseForm;
