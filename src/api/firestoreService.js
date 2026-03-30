import { db } from "./firebase";
export { db };
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

// 1. Create a new group
export const createGroup = async (groupName, members) => {
  return await addDoc(collection(db, "groups"), {
    name: groupName,
    members,
    createdAt: serverTimestamp(),
  });
};

// 3. Real-time listener for expenses
export const subscribeToExpenses = (groupId, callback) => {
  const q = query(collection(db, "expenses"), where("groupId", "==", groupId));
  return onSnapshot(q, (snapshot) => {
    const expenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(expenses);
  });
};

export const addExpense = async (groupId, expenseData) => {
  try {
    const docRef = await addDoc(collection(db, "expenses"), {
      ...expenseData,
      groupId,
      timestamp: serverTimestamp(),
    });
    return docRef;
  } catch (e) {
    console.error("Error adding document:", e);
    throw e;
  }
};
