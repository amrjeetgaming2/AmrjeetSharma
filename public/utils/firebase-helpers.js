import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signOut,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from '../firebase-config.js';

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Create or update user profile in Firestore
    await createOrUpdateUserProfile(user);
    
    return { success: true, user };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { success: false, error: error.message };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: error.message };
  }
};

// Create or update user profile in Firestore
export const createOrUpdateUserProfile = async (firebaseUser) => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);
  
  const userData = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    lastLogin: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  if (!userSnap.exists()) {
    // New user - create profile
    userData.createdAt = serverTimestamp();
    userData.gamesPlayed = 0;
    userData.totalScore = 0;
    userData.highScore = 0;
    userData.playTime = 0;
    
    await setDoc(userRef, userData);
    console.log("New user profile created");
  } else {
    // Existing user - update last login
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("User profile updated");
  }
  
  return userData;
};

// Get user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No user data found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Update game stats
export const updateGameStats = async (userId, gameData) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return { success: false, error: "User not found" };
    
    const currentData = userSnap.data();
    const updates = {
      updatedAt: serverTimestamp(),
      gamesPlayed: (currentData.gamesPlayed || 0) + 1,
    };
    
    // Update high score if current score is higher
    if (gameData.score > (currentData.highScore || 0)) {
      updates.highScore = gameData.score;
    }
    
    // Update total score
    updates.totalScore = (currentData.totalScore || 0) + gameData.score;
    
    // Update play time in minutes
    updates.playTime = (currentData.playTime || 0) + (gameData.playTime || 0);
    
    await updateDoc(userRef, updates);
    return { success: true };
  } catch (error) {
    console.error("Error updating game stats:", error);
    return { success: false, error: error.message };
  }
};