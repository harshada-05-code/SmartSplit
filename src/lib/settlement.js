export const calculateBalances = (expenses, members) => {
  const balances = {};
  members.forEach(m => balances[m] = 0);
  expenses.forEach(exp => {
    const share = exp.amount / members.length;
    balances[exp.payerId] += exp.amount;
    members.forEach(m => balances[m] -= share);
  });
  return balances;
};

export const minimizeTransactions = (balances) => {
  let debtors = [], creditors = [];
  Object.entries(balances).forEach(([user, amount]) => {
    if (amount < -0.1) debtors.push({ user, amount: Math.abs(amount) });
    else if (amount > 0.1) creditors.push({ user, amount });
  });

  const transactions = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const settleAmount = Math.min(debtors[i].amount, creditors[j].amount);
    transactions.push({
      from: debtors[i].user,
      to: creditors[j].user,
      amount: settleAmount.toFixed(2),
      // UPI Link generation for "One-Tap Payment"
      upiUrl: `upi://pay?pa=payee@upi&pn=${creditors[j].user}&am=${settleAmount.toFixed(2)}&cu=INR`
    });
    debtors[i].amount -= settleAmount;
    creditors[j].amount -= settleAmount;
    if (debtors[i].amount < 0.1) i++;
    if (creditors[j].amount < 0.1) j++;
  }
  return transactions;
};
