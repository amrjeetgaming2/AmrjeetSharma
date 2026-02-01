import { signInWithGoogle, signOutUser, getUserData, updateGameStats } from './utils/firebase-helpers.js';
import { initAuthState, getCurrentUser } from './utils/auth-state.js';

class ZeroCutGoApp {
  constructor() {
    this.currentScreen = 'auth';
    this.currentUser = null;
    this.userData = null;
    
    this.init();
  }
  
  async init() {
    // DOM Elements
    this.authScreen = document.getElementById('auth-screen');
    this.gameScreen = document.getElementById('game-screen');
    this.profileScreen = document.getElementById('profile-screen');
    this.googleSignInBtn = document.getElementById('google-signin-btn');
    this.loadingOverlay = document.getElementById('loading-overlay');
    
    // Initialize auth state listener
    initAuthState({
      onSignedIn: (user) => this.handleUserSignedIn(user),
      onSignedOut: () => this.handleUserSignedOut(),
      onAuthStateChange: (isSignedIn) => this.toggleLoading(!isSignedIn)
    });
    
    // Event Listeners
    this.googleSignInBtn?.addEventListener('click', () => this.signIn());
    
    // Initialize header navigation
    this.initHeaderNavigation();
    
    // Initialize game (placeholder for now)
    this.initGame();
  }
  
  async handleUserSignedIn(user) {
    this.currentUser = user;
    
    // Get user data from Firestore
    this.userData = await getUserData(user.uid);
    
    // Update UI with user info
    this.updateUserProfileUI();
    
    // Switch to game screen
    this.switchScreen('game');
    
    console.log('User signed in:', user.displayName);
  }
  
  handleUserSignedOut() {
    this.currentUser = null;
    this.userData = null;
    
    // Switch to auth screen
    this.switchScreen('auth');
    
    console.log('User signed out');
  }
  
  async signIn() {
    this.toggleLoading(true);
    const result = await signInWithGoogle();
    
    if (!result.success) {
      alert(`Sign in failed: ${result.error}`);
    }
    
    this.toggleLoading(false);
  }
  
  async signOut() {
    this.toggleLoading(true);
    await signOutUser();
    this.toggleLoading(false);
  }
  
  switchScreen(screenName) {
    // Hide all screens
    this.authScreen?.classList.remove('active');
    this.gameScreen?.classList.remove('active');
    this.profileScreen?.classList.remove('active');
    
    // Show selected screen
    this.currentScreen = screenName;
    
    switch (screenName) {
      case 'auth':
        this.authScreen?.classList.add('active');
        break;
      case 'game':
        this.gameScreen?.classList.add('active');
        break;
      case 'profile':
        this.profileScreen?.classList.add('active');
        // Refresh profile data when switching to profile screen
        if (this.currentUser) {
          this.updateUserProfileUI();
        }
        break;
    }
    
    // Update header navigation
    this.updateHeaderNavigation();
  }
  
  updateUserProfileUI() {
    if (!this.userData || !this.currentUser) return;
    
    // Update profile page
    document.getElementById('user-name').textContent = this.userData.name || 'User';
    document.getElementById('user-email').textContent = this.userData.email || '';
    
    // Format dates
    const formatDate = (timestamp) => {
      if (!timestamp) return '--';
      const date = timestamp.toDate();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };
    
    document.getElementById('member-since').textContent =
      formatDate(this.userData.createdAt);
    document.getElementById('last-login').textContent =
      formatDate(this.userData.lastLogin);
    
    // Update stats
    document.getElementById('games-played').textContent =
      this.userData.gamesPlayed || 0;
    document.getElementById('total-score').textContent =
      this.userData.totalScore || 0;
    document.getElementById('avg-score').textContent =
      this.userData.gamesPlayed > 0 ?
      Math.round((this.userData.totalScore || 0) / this.userData.gamesPlayed) :
      0;
    document.getElementById('play-time').textContent =
      Math.round(this.userData.playTime || 0);
    
    // Update high score in game screen
    document.getElementById('high-score').textContent =
      this.userData.highScore || 0;
    
    // Update avatar
    const avatarContainer = document.getElementById('user-avatar');
    if (avatarContainer && this.userData.photoURL) {
      avatarContainer.innerHTML = `
        <img src="${this.userData.photoURL}" alt="${this.userData.name}" class="user-avatar">
      `;
    } else {
      avatarContainer.innerHTML = `
        <div class="avatar-placeholder">
          ${(this.userData.name || 'U').charAt(0).toUpperCase()}
        </div>
      `;
    }
  }
  
  initHeaderNavigation() {
    // Header will be initialized by header-nav.js component
    // This is a placeholder for header interaction
    document.addEventListener('nav-action', (e) => {
      const { action } = e.detail;
      
      switch (action) {
        case 'go-to-game':
          this.switchScreen('game');
          break;
        case 'go-to-profile':
          this.switchScreen('profile');
          break;
        case 'sign-out':
          this.signOut();
          break;
      }
    });
  }
  
  updateHeaderNavigation() {
    // Dispatch event to update header state
    const event = new CustomEvent('screen-changed', {
      detail: { screen: this.currentScreen }
    });
    document.dispatchEvent(event);
  }
  
  initGame() {
    // Placeholder for game integration
    // In a real implementation, this would initialize the actual game
    console.log('Game initialization placeholder');
    
    // Example: Simulate game completion
    setTimeout(() => {
      // This would be called when game ends
      // this.saveGameResult(score, playTime);
    }, 1000);
  }
  
  async saveGameResult(score, playTime) {
    if (!this.currentUser) return;
    
    const gameData = {
      score: score,
      playTime: playTime / 60, // Convert to minutes
      timestamp: new Date().toISOString()
    };
    
    // Update user stats in Firestore
    const result = await updateGameStats(this.currentUser.uid, gameData);
    
    if (result.success) {
      console.log('Game stats updated');
      // Refresh user data
      this.userData = await getUserData(this.currentUser.uid);
      this.updateUserProfileUI();
    } else {
      console.error('Failed to update game stats:', result.error);
    }
  }
  
  toggleLoading(show) {
    if (this.loadingOverlay) {
      this.loadingOverlay.style.display = show ? 'flex' : 'none';
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new ZeroCutGoApp();
});