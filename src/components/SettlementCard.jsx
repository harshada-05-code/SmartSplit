import { ArrowRight, CheckCircle } from 'lucide-react';

export const SettlementCard = ({ from, to, amount }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between group transition-all hover:shadow-md">
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Debtor</span>
      <span className="font-semibold dark:text-white">{from}</span>
    </div>
    
    <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
      <span className="text-lg font-black text-primary">₹{amount}</span>
      <ArrowRight className="text-primary/40" size={20} />
    </div>

    <div className="flex flex-col text-right">
      <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Creditor</span>
      <span className="font-semibold dark:text-white">{to}</span>
    </div>
    
    {/* 8. One-Tap UPI Payment Button */}
    <a 
      href={`upi://pay?pa=YOUR_UPI_ID@okicici&pn=${to}&am=${amount}&cu=INR`}
      className="ml-4 p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors"
    >
      <CheckCircle size={20} />
    </a>
  </div>
);
