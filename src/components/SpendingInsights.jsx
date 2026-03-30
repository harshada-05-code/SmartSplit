import React from 'react';
import { PieChart, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981'];

const SpendingInsights = ({ expenses }) => {
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);

  const colors = {
    food: "bg-orange-500",
    travel: "bg-blue-500",
    bills: "bg-red-500",
    entertainment: "bg-purple-500",
    others: "bg-gray-500"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <PieChart className="text-primary" size={18}/> Category Breakdown
      </h3>
      
      <div className="space-y-5">
        {Object.entries(categoryTotals).map(([cat, amt]) => {
          const percentage = ((amt / total) * 100).toFixed(0);
          return (
            <div key={cat} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span className="capitalize">{cat}</span>
                <span>{percentage}% (₹{amt})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colors[cat] || colors.others} transition-all duration-1000`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        {total > 0 && (
          <div className="mt-6 p-4 bg-green-50 rounded-xl flex items-start gap-3">
            <TrendingDown className="text-green-600 mt-1" size={20} />
            <p className="text-xs text-green-800">
              <strong>Smart Tip:</strong> {Object.entries(categoryTotals).sort((a,b) => b[1]-a[1])[0][0]} is your highest expense. 
              Reducing this by 10% could save you ₹{(total * 0.1).toFixed(0)}! [cite: 27]
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SpendingInsights({ expenses }) {
  const data = Object.entries(
    expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm h-64">
      <h3 className="text-sm font-bold mb-2 dark:text-white">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} innerRadius={50} outerRadius={70} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

