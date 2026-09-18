/**
 * Inclusive Trip Project - Authentication Guard & Dashboard Controller
 * Enforces session verification on protected views and handles user logout.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Verify user is authenticated
  if (!window.authService || !window.authService.isAuthenticated()) {
    // Not authenticated; redirect to login page
    window.location.href = 'login.html';
    return;
  }

  // Populate user data on protected pages
  const user = window.authService.getCurrentUser();
  const userNameElem = document.getElementById('user-display-name');
  const userEmailElem = document.getElementById('user-display-email');
  const userRoleElem = document.getElementById('user-display-role');

  if (userNameElem && user) {
    userNameElem.textContent = user.name || 'Traveler';
  }
  if (userEmailElem && user) {
    userEmailElem.textContent = user.email || '';
  }
  if (userRoleElem && user) {
    userRoleElem.textContent = user.role || 'Member';
  }

  // Handle Logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.authService.logout();
      window.location.href = 'login.html';
    });
  }
});
