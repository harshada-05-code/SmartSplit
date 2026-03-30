import React from 'react';
import { PieChart as PieChartIcon, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6'];

const SpendingInsights = ({ expenses }) => {
  const categoryTotals = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="card card-hover h-80 p-6">
      <h3 className="mb-4 flex items-center gap-2 font-extrabold text-slate-900 dark:text-white">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <PieChartIcon size={18} />
        </span>
        Category Breakdown
      </h3>
      
      <div className="h-full w-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid rgba(148, 163, 184, 0.25)',
                boxShadow: '0 18px 35px rgba(2, 6, 23, 0.18)',
                backdropFilter: 'blur(12px)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingInsights;