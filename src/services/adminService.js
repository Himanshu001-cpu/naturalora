import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Checks if a user UID exists in the 'admins' collection and has admin role.
 * @param {string} uid - Firebase Auth user UID
 * @returns {Promise<{isAdmin: boolean, role: string|null, data: object|null}>}
 */
export const checkAdminStatus = async (uid) => {
  if (!uid) return { isAdmin: false, role: null, data: null };

  try {
    const adminDocRef = doc(db, "admins", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      const data = adminDocSnap.data();
      const role = data.role || "admin";
      return {
        isAdmin: true,
        role: role,
        data: data,
      };
    }
    return { isAdmin: false, role: null, data: null };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false, role: null, data: null };
  }
};

/**
 * Bootstrap or register a new admin document in Firestore.
 * Useful for seeding the first admin or adding new admins.
 * @param {string} uid - Firebase Auth user UID
 * @param {string} [role="super_admin"] - Admin role
 * @returns {Promise<object>} Created admin data
 */
export const createAdminUser = async (uid, role = "super_admin") => {
  if (!uid) throw new Error("User UID is required to create admin");

  const adminData = {
    uid,
    role,
    createdAt: serverTimestamp(),
  };

  await setDoc(doc(db, "admins", uid), adminData);
  return adminData;
};
