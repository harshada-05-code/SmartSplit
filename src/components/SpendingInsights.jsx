import React from 'react';
import { PieChart, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981'];

export default function SpendingInsights({ expenses }) {
// to show the expenses according to category.
  const data = Object.entries(
    expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg h-64 border border-gray-100 dark:border-gray-700">
      <h3 className="text-sm font-bold mb-4 dark:text-white">📊 Spending Insights</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

