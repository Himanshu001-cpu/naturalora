import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  registerUser,
  loginUser,
  logoutUser,
  ensureUserDocument,
  updateUserProfile,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Single subscription to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch or create matching Firestore user profile
        try {
          const profile = await ensureUserDocument(currentUser);
          setUserProfile(profile);
        } catch (err) {
          console.error("Error fetching user profile on auth change:", err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const loggedInUser = await loginUser(email, password);
    const profile = await ensureUserDocument(loggedInUser);
    setUserProfile(profile);
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const { user: registeredUser, profile } = await registerUser(name, email, password);
    setUser(registeredUser);
    setUserProfile(profile);
    return registeredUser;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (updates) => {
    if (!user?.uid) throw new Error("No authenticated user.");
    const updatedProfile = await updateUserProfile(user.uid, updates);
    if (updatedProfile) {
      setUserProfile(updatedProfile);
    }
    return updatedProfile;
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    updateProfileData,
    refreshProfile: async () => {
      if (user?.uid) {
        const profile = await ensureUserDocument(user);
        setUserProfile(profile);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
