# Development Tools

This folder contains development and debugging tools. These are not part of the main application but can be useful during development.

## Available Tools:

### 1. `/make-admin` - Make User Admin
**Purpose:** Convert any user account to admin role
**Usage:** 
- Navigate to `http://localhost:3000/_dev-tools/make-admin`
- Enter the email address of the user
- Click "Make Admin"
- The user's role will be updated in the database

### 2. `/debug-auth` - Auth Debug Panel
**Purpose:** Debug authentication and Redux state issues
**Usage:**
- Navigate to `http://localhost:3000/_dev-tools/debug-auth`
- View current authentication state
- Force admin role in Redux
- Clear localStorage
- Test admin dashboard access

### 3. `/fix-admin` - Quick Admin Fix
**Purpose:** Quickly set admin role in Redux without database changes
**Usage:**
- Navigate to `http://localhost:3000/_dev-tools/fix-admin`
- Click "Set Admin Role & Go to Dashboard"
- Automatically redirects to admin dashboard

## When to Use:

- **During Development:** When you need to quickly test admin features
- **Debugging:** When authentication or role-based access isn't working
- **Testing:** When you need to switch between user and admin roles

## Security Note:

⚠️ **IMPORTANT:** These tools should be removed or protected in production!

Consider:
1. Deleting this entire `_dev-tools` folder before deployment
2. Adding authentication checks to these routes
3. Using environment variables to enable/disable these tools

## Current Admin Protection Status:

The `ProtectedAdminRoute` component currently has `BYPASS_ADMIN_CHECK = true` for development.

**To enable proper protection:**
1. Open `components/Application/Admin/ProtectedAdminRoute.jsx`
2. Change `const BYPASS_ADMIN_CHECK = true` to `false`
3. Ensure your user has `role: 'admin'` in the database

## API Routes:

These tools use the following API endpoint:
- `POST /api/auth/make-admin` - Updates user role to admin in database

This API route is located at: `app/api/auth/make-admin/route.js`
