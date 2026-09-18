/**
 * Inclusive Trip Project - Login Form Controller (ITD-12)
 * Handles client-side validation, password masking toggle,
 * submission handling, UI feedback, and redirection.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember-me');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const submitBtn = document.getElementById('submit-btn');
  const alertContainer = document.getElementById('alert-container');

  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');

  // Quick fill button for testers
  const fillDemoBtn = document.getElementById('fill-demo-btn');
  if (fillDemoBtn) {
    fillDemoBtn.addEventListener('click', () => {
      emailInput.value = 'traveler@inclusivetrip.org';
      passwordInput.value = 'Password@123';
      clearErrors();
      emailInput.focus();
    });
  }

  // If already logged in, redirect to home/dashboard
  if (window.authService && window.authService.isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  // 1. Requirement 4: Keep password hidden with toggle option
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      togglePasswordBtn.textContent = isPassword ? 'Hide' : 'Show';
    });
  }

  // Real-time input clearing of errors
  emailInput.addEventListener('input', () => {
    validateEmailField(false);
  });

  passwordInput.addEventListener('input', () => {
    validatePasswordField(false);
  });

  // 2. Email validation logic (RFC 5322 standard pattern)
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateEmailField(showEmptyError = true) {
    const value = emailInput.value.trim();
    const group = emailInput.closest('.form-group');

    if (!value) {
      if (showEmptyError) {
        setFieldError(emailInput, group, emailError, 'Email address is required.');
        return false;
      }
      return false;
    }

    if (!isValidEmail(value)) {
      setFieldError(emailInput, group, emailError, 'Please enter a valid email address (e.g. name@example.com).');
      return false;
    }

    clearFieldError(emailInput, group, emailError);
    return true;
  }

  function validatePasswordField(showEmptyError = true) {
    const value = passwordInput.value;
    const group = passwordInput.closest('.form-group');

    if (!value) {
      if (showEmptyError) {
        setFieldError(passwordInput, group, passwordError, 'Password is required.');
        return false;
      }
      return false;
    }

    clearFieldError(passwordInput, group, passwordError);
    return true;
  }

  function setFieldError(input, group, errorElement, message) {
    group.classList.add('has-error');
    input.classList.add('is-invalid');
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  function clearFieldError(input, group, errorElement) {
    group.classList.remove('has-error');
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }

  function clearErrors() {
    clearFieldError(emailInput, emailInput.closest('.form-group'), emailError);
    clearFieldError(passwordInput, passwordInput.closest('.form-group'), passwordError);
    hideAlert();
  }

  function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `
      <div class="alert alert-${type}" role="alert">
        <span class="alert-icon">${type === 'danger' ? '⚠️' : '✓'}</span>
        <span>${message}</span>
      </div>
    `;
    alertContainer.style.display = 'block';
  }

  function hideAlert() {
    alertContainer.innerHTML = '';
    alertContainer.style.display = 'none';
  }

  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.innerHTML = `<span class="spinner" aria-hidden="true"></span> Signing in...`;
    } else {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-busy');
      submitBtn.innerHTML = `Sign In`;
    }
  }

  // 3. Form Submit Handler
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const isEmailValid = validateEmailField(true);
    const isPasswordValid = validatePasswordField(true);

    // Stop if client validation fails (Requirements 2 & 3)
    if (!isEmailValid || !isPasswordValid) {
      if (!isEmailValid) {
        emailInput.focus();
      } else {
        passwordInput.focus();
      }
      return;
    }

    // Begin authentication process (Requirements 5, 7, 8, 9)
    setLoading(true);

    try {
      const email = emailInput.value;
      const password = passwordInput.value;
      const rememberMe = rememberCheckbox ? rememberCheckbox.checked : false;

      const result = await window.authService.login(email, password, rememberMe);

      if (result.success) {
        showAlert('Login successful! Redirecting to your dashboard...', 'success');
        // Redirect to authenticated home page (Requirement 9)
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 600);
      } else {
        // Display clear error for invalid credentials (Requirement 8)
        showAlert(result.message || 'Invalid credentials. Please try again.', 'danger');
        passwordInput.classList.add('is-invalid');
        passwordInput.focus();
      }
    } catch (err) {
      console.error('[Login] Unexpected error during authentication:', err);
      showAlert('A network error occurred. Please check your connection and try again.', 'danger');
    } finally {
      setLoading(false);
    }
  });
});
