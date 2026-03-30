import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";

// 1. Create a new group
export const createGroup = async (groupName, members) => {
  return await addDoc(collection(db, "groups"), {
    name: groupName,
    members: members, // Array of names or IDs
    createdAt: new Date()
  });
};

// 2. Add an expense to a group
export const addExpense = async (groupId, expenseData) => {
  // expenseData should include: title, amount, payer, splitDetails, category
  return await addDoc(collection(db, "expenses"), {
    ...expenseData,
    groupId,
    timestamp: new Date()
  });
};

// 3. Real-time listener for expenses
export const subscribeToExpenses = (groupId, callback) => {
  const q = query(collection(db, "expenses"), where("groupId", "==", groupId));
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(expenses);
  });
};
