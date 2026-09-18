# Inclusive Trip Project

An accessible and barrier-free travel platform connecting travelers with verified accessible destinations, quiet sensory zones, and specialized transit assistance.

---

## Jira Issue ITD-12: User Login

This repository contains the implementation of **ITD-12: User Login**.

### Requirements Implemented

1. **Login Page**:
   - Clean, accessible login page at [`login.html`](file:///d:/project/inclusive/login.html).
   - Contains **Email address**, **Password** (hidden by default), and a primary **Sign In** button.
2. **Field Validation**:
   - **Required Fields**: Both email and password inputs are validated as required with inline accessibility cues.
   - **Email Format**: Validates standard RFC email syntax (e.g. `user@example.com`).
   - **Password Security**: Kept hidden by default (`type="password"`) with an accessible Show/Hide toggle button.
3. **Backend / API Connection**:
   - Implemented in [`js/auth-service.js`](file:///d:/project/inclusive/js/auth-service.js).
   - Dispatches `POST` request to `/api/v1/auth/login`.
   - Includes graceful mock fallback handling for offline/local standalone testing.
4. **Response & Error Handling**:
   - Handles HTTP 200 (Success) and HTTP 401 / 400 (Failure).
   - Displays clear error alerts when credentials are invalid.
   - Prevents hardcoding of sensitive credentials or tokens in frontend code.
5. **Redirection & Route Protection**:
   - On successful authentication, sets user session token and redirects to [`index.html`](file:///d:/project/inclusive/index.html).
   - Authenticated home page verifies session via [`js/auth-guard.js`](file:///d:/project/inclusive/js/auth-guard.js) and displays user profile and accessible trips.
   - Includes full sign-out flow returning the user to the login page.
6. **Accessibility & Responsive Design**:
   - WCAG 2.1 AA compliant colors and contrast ratios.
   - Responsive design adapted for mobile, tablet, and desktop viewports.

---

## File Structure

```text
inclusive/
├── index.html              # Authenticated Home / Dashboard
├── login.html              # ITD-12 User Login Page
├── css/
│   ├── main.css           # Design tokens, typography, utilities, and components
│   └── login.css          # Login card layout, input groups, animations
├── js/
│   ├── auth-service.js    # Authentication API service client and mock responder
│   ├── auth-guard.js      # Session verification and logout handler
│   └── login.js           # Login form controller: validation and submission
└── README.md               # Documentation and test guide
```

---

## How to Run the Project

Since Python 3.12 is installed on the system, you can run the local development server immediately using Python's built-in HTTP server:

```powershell
# Open terminal in the project directory:
cd D:\project\inclusive

# Start the local HTTP server:
python -m http.server 8000
```

Then open your browser and navigate to:
**`http://localhost:8000/login.html`**

---

## How to Test Jira ITD-12

Use the following test scenarios to verify all ticket acceptance criteria:

### Test Case 1: Empty Field Validation
1. Open `http://localhost:8000/login.html`.
2. Leave both email and password blank.
3. Click **Sign In**.
4. **Expected Result**: Form submission is blocked; "Email address is required" error message is displayed and the field is highlighted in red.

### Test Case 2: Invalid Email Format Validation
1. Enter `invalid-user` into the Email Address field.
2. Enter any password and click **Sign In**.
3. **Expected Result**: Form submission is blocked; "Please enter a valid email address (e.g. name@example.com)" is displayed.

### Test Case 3: Password Masking and Toggle
1. Type characters into the Password field.
2. **Expected Result**: Characters are masked (`••••••••`).
3. Click the **Show** button next to the password input.
4. **Expected Result**: Password characters become visible as plain text and button label switches to **Hide**.

### Test Case 4: Invalid Credentials (Error Handling)
1. Enter `traveler@inclusivetrip.org` in Email.
2. Enter `WrongPassword999` in Password.
3. Click **Sign In**.
4. **Expected Result**: Loading spinner appears during API call, followed by a clear red alert: *"Invalid email or password. Please verify your credentials and try again."*

### Test Case 5: Successful Login & Redirect
1. Click the **Autofill Demo** button (or enter):
   - **Email**: `traveler@inclusivetrip.org`
   - **Password**: `Password@123`
2. Click **Sign In**.
3. **Expected Result**: Green success alert appears (*"Login successful! Redirecting to your dashboard..."*), session token is stored, and the user is redirected to `index.html`.
4. The dashboard displays the user's name (*Alex Morgan*), role (*Traveler*), and email.

### Test Case 6: Sign Out Flow
1. On `index.html`, click **Log Out** in the top navigation bar.
2. **Expected Result**: Session is terminated and the browser redirects back to `login.html`.

---

## Backend API Integration Note

To connect this login page to a live production or staging backend:
1. Set `window.ENV_API_URL = "https://your-backend-api.com/api/v1";` in `login.html` or in an environment config file.
2. Ensure your backend exposes `POST /api/v1/auth/login` accepting:
   ```json
   {
     "email": "user@example.com",
     "password": "userpassword"
   }
   ```
   and returning:
   ```json
   {
     "token": "<jwt_or_bearer_token>",
     "user": {
       "name": "User Name",
       "email": "user@example.com",
       "role": "Traveler"
     }
   }
   ```
