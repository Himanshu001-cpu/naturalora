import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

/**
 * Maps Firebase Auth error codes to user-friendly error messages.
 */
export const mapAuthError = (error) => {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || error.message || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Invalid email address format.";
    case "auth/operation-not-allowed":
      return "Email/password accounts are not enabled.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 8 characters.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Please check your credentials.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Please try again later.";
    case "auth/network-request-failed":
      return "Network failure. Please check your internet connection.";
    default:
      return error.message || "Authentication failed. Please try again.";
  }
};

/**
 * Create user account with Firebase Auth and initialize Firestore user document.
 */
export const registerUser = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfileData = {
      uid: user.uid,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: "",
      address: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Store user document in Firestore 'users' collection
    await setDoc(doc(db, "users", user.uid), userProfileData);

    return { user, profile: userProfileData };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error(mapAuthError(error));
  }
};

/**
 * Log in existing user with Firebase Auth.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error(mapAuthError(error));
  }
};

/**
 * Log out current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Fetch Firestore user document by UID.
 */
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Automatically create Firestore user document if missing after auth.
 */
export const ensureUserDocument = async (user, additionalData = {}) => {
  if (!user?.uid) return null;
  try {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const userProfileData = {
        uid: user.uid,
        name: additionalData.name || user.displayName || "Customer",
        email: user.email || "",
        phone: additionalData.phone || user.phoneNumber || "",
        address: additionalData.address || "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, userProfileData);
      return userProfileData;
    }
    return docSnap.data();
  } catch (error) {
    console.error("Error ensuring user document:", error);
    return null;
  }
};

/**
 * Update user profile details (Name, Phone, Address) in Firestore.
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const docRef = doc(db, "users", uid);
    const payload = {
      ...(updates.name !== undefined && { name: updates.name.trim() }),
      ...(updates.phone !== undefined && { phone: updates.phone.trim() }),
      ...(updates.address !== undefined && { address: updates.address.trim() }),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);

    const updatedSnap = await getDoc(docRef);
    return updatedSnap.exists() ? updatedSnap.data() : null;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update profile. Please try again.");
  }
};

/**
 * Fetch all orders belonging to a specific user UID.
 */
export const getUserOrders = async (uid) => {
  if (!uid) return [];
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", uid));
    const querySnapshot = await getDocs(q);

    const orders = querySnapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
      };
    });

    // Client-side sort by date descending
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};
