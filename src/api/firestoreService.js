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

/** Firestore rejects `undefined` field values. */
function omitUndefined(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
}

// 1. Create a new group
export const createGroup = async (groupName, members) => {
  return await addDoc(
    collection(db, "groups"),
    omitUndefined({
      name: groupName.trim(),
      members: Array.isArray(members) ? members : [],
      createdAt: serverTimestamp(),
    })
  );
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
  if (!groupId) {
    throw new Error("addExpense: groupId is required");
  }
  const payload = omitUndefined({
    ...expenseData,
    groupId,
    timestamp: serverTimestamp(),
  });
  try {
    return await addDoc(collection(db, "expenses"), payload);
  } catch (e) {
    console.error("Error adding document:", e);
    throw e;
  }
};
