import { getCurrentUser } from '../utils/auth-state.js';

class HeaderNavigation extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    this.innerHTML = `
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2L30 16L16 30L2 16L16 2Z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M8 8L24 24" stroke="currentColor" stroke-width="2"/>
          <path d="M8 24L24 8" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Zero Cut</span>
      </div>
      <div class="nav-controls" id="nav-controls">
        <!-- Controls will be dynamically rendered based on auth state -->
      </div>
    `;
    
    this.updateNavigation();
  }
  
  updateNavigation() {
    const controlsContainer = this.querySelector('#nav-controls');
    const user = getCurrentUser();
    
    if (user) {
      // User is logged in
      controlsContainer.innerHTML = `
        <button class="nav-btn" data-action="go-to-game">
          <span class="material-icons">sports_esports</span>
          <span>Game</span>
        </button>
        <button class="nav-btn" data-action="go-to-profile">
          <div class="user-avatar-small">
            ${user.photoURL ? 
              `<img src="${user.photoURL}" alt="${user.displayName}" class="user-avatar-small">` : 
              `<div class="avatar-placeholder">${(user.displayName || 'U').charAt(0)}</div>`
            }
          </div>
          <span>Profile</span>
        </button>
        <button class="nav-btn" data-action="sign-out">
          <span class="material-icons">logout</span>
          <span>Sign Out</span>
        </button>
      `;
    } else {
      // User is not logged in
      controlsContainer.innerHTML = `
        <button class="nav-btn primary" data-action="go-to-auth">
          <span class="material-icons">login</span>
          <span>Sign In</span>
        </button>
      `;
    }
    
    // Re-attach event listeners
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    const buttons = this.querySelectorAll('.nav-btn');
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const action = button.dataset.action;
        this.dispatchAction(action);
      });
    });
  }
  
  dispatchAction(action) {
    const event = new CustomEvent('nav-action', {
      detail: { action },
      bubbles: true
    });
    this.dispatchEvent(event);
  }
}

// Listen for screen changes to update navigation
document.addEventListener('screen-changed', () => {
  const header = document.querySelector('header-navigation');
  if (header) {
    header.updateNavigation();
  }
});

// Define the custom element
customElements.define('header-navigation', HeaderNavigation);

// Insert header into the page
document.addEventListener('DOMContentLoaded', () => {
  const headerElement = document.querySelector('.app-header');
  if (headerElement) {
    const nav = document.createElement('header-navigation');
    headerElement.appendChild(nav);
  }
});