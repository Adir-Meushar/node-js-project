# Project Node.Js
A Node.js web application for user and business card management.
## Api Documentaion
For detailed information on the API endpoints and usage, refer to this link:https://documenter.getpostman.com/view/28292567/2s9Yyqj2pR
## Overview
This Node.js project is designed to streamline user and business card management. Leveraging Express.js for server-side development, MongoDB as the database, and JSON Web Tokens (JWT) for authentication, the application offers a secure and feature-rich experience.

## Features
#### User Management:
User registration, login, profile editing, and deletion.
Role-based access with admin privileges for additional actions.

#### Card Management:
Business users can create, edit, and delete their business cards.
Users can like or unlike business cards.

#### Custom Error Handling:
Custom 404 error page for a user-friendly experience on undefined routes.
Meaningful error messages for various scenarios.

#### Frontend Integration:
Static files, including an HTML error page, are served through Express for enhanced styling.

#### Security Measures:
Passwords are securely hashed using bcrypt.
JSON Web Tokens (JWT) for secure user authentication.
Middleware ensures proper access controls and permissions.

## Overall Architecture
The project follows a modular structure, with organized routes, middleware, models, and validation using Joi.
MongoDB serves as the data store, ensuring efficient and scalable data management. 
JSON Web Tokens (JWT) provide a secure authentication mechanism.

### Technologies Used
- **Node.js:**
  - JavaScript runtime environment for server-side development.

- **bcrypt:**
  - Password hashing for secure storage.

- **chalk:**
  - Terminal string styling for enhanced console output.

- **cors:**
  - Middleware for Cross-Origin Resource Sharing in Express.js.

- **dotenv:**
  - Environment variable management for configuration.

- **express:**
  - Web application framework for building server-side logic.

- **fs:**
  - Node.js file system module for file interactions.

- **joi:**
  - Object schema validation for data sanitization.

- **jsonwebtoken:**
  - Creation and verification of JSON Web Tokens for secure authentication.

- **moment:**
  - Date and time manipulation library for JavaScript.

- **mongoose:**
  - MongoDB object modeling for schema-based database interaction.

These technologies collectively power the Node.js backend, ensuring security, functionality, and efficient data management in the web application.

