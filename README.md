# Project Node.Js
A Node.js web application for user and business card management.

## Overview
This Node.js project is designed to streamline user and business card management. Leveraging Express.js for server-side development, MongoDB as the database, and JSON Web Tokens (JWT) for authentication, the application offers a secure and feature-rich experience.

## Features
**User Management**:
User registration, login, profile editing, and deletion.
Role-based access with admin privileges for additional actions.
**Card Management**:
Business users can create, edit, and delete their business cards.
Users can like or unlike business cards.
**Custom Error Handling**:
Custom 404 error page for a user-friendly experience on undefined routes.
Meaningful error messages for various scenarios.
**Frontend Integration**:
Static files, including an HTML error page, are served through Express for enhanced styling.
**Security Measures**:
Passwords are securely hashed using bcrypt.
JSON Web Tokens (JWT) for secure user authentication.
Middleware ensures proper access controls and permissions.
