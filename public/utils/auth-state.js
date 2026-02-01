import { auth, onAuthStateChanged } from '../firebase-config.js';

// Auth state observer
export const initAuthState = (callbacks) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      if (callbacks.onSignedIn) callbacks.onSignedIn(user);
    } else {
      // User is signed out
      if (callbacks.onSignedOut) callbacks.onSignedOut();
    }
    
    if (callbacks.onAuthStateChange) callbacks.onAuthStateChange(!!user);
  });
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};