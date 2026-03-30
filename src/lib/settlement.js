/**
 * Step 1: Calculate Net Balance for each user
 * Balance = (What you paid) - (What you owe)
 */
export const calculateBalances = (expenses, members) => {
  const balances = {};
  members.forEach(m => balances[m] = 0);

  expenses.forEach(exp => {
    const share = exp.amount / members.length;
    
    // Add full amount to the payer's balance
    balances[exp.payerId] += exp.amount;
    
    // Subtract share from everyone (including the payer)
    members.forEach(m => {
      balances[m] -= share;
    });
  });
  return balances;
};

/**
 * Step 2: Minimize Transactions (Greedy Algorithm)
 * Complexity: O(N log N)
 */
export const minimizeTransactions = (balances) => {
  let debtors = [];
  let creditors = [];

  Object.entries(balances).forEach(([user, amount]) => {
    if (amount < -0.1) debtors.push({ user, amount: Math.abs(amount) });
    else if (amount > 0.1) creditors.push({ user, amount });
  });

  // Sort to always settle largest amounts first
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const settleAmount = Math.min(debtors[i].amount, creditors[j].amount);
    
    transactions.push({
      from: debtors[i].user,
      to: creditors[j].user,
      amount: settleAmount.toFixed(2)
    });

    debtors[i].amount -= settleAmount;
    creditors[j].amount -= settleAmount;

    if (debtors[i].amount < 0.1) i++;
    if (creditors[j].amount < 0.1) j++;
  }
  return transactions;
};
