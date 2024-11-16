# 🚀  Assignment Submission Portal


This repository contains the backend system for an **Assignment Submission Portal**, designed to allow users to submit assignments and admins to review and manage those submissions.


## 🌟 **Overview**

The portal supports two types of users: **Users** and **Admins**.  
- **Users** can register, log in, and upload assignments.  
- **Admins** can register, log in, view assignments tagged to them, and either accept or reject submissions.



## ✨ **Features**

### **User Features**
- **Register and Log In:** Secure user authentication to access the portal Using JWT OR Google OAuth.
- **Upload Assignments:** Submit assignments to be reviewed by admins.
- **View Admins:** Retrieve a list of admins.

### **Admin Features**
- **Register and Log In:** Secure admin authentication to access the portal Using JWT OR Google OAuth.
- **View Assignments:** Access all assignments tagged to them with details like user name, task, and submission date/time.
- **Accept/Reject Assignments:** Manage assignment status based on admin review.


## 🛠️ **API Endpoints**

### **User Endpoints**
- `POST /api/v1/users/register`  
  **Description:** Register a new user.  
  **Input:** User details (name, email, password).

- `POST /api/v1/users/login`  
  **Description:** Log in with credentials.  
  **Input:** Email and password.

- `POST /api/v1/users/google`  
  **Description:** Log in with Google oAuth2.  

- `POST /api/v1/users/upload`  
  **Description:** Upload an assignment.  
  **Input:** Assignment details (`userId`, `task`, `admin`).

- `GET /api/v1/users/admins`  
  **Description:** Retrieve all registered admins.

### **Admin Endpoints**
- `POST /api/v1/users/register`  
  **Description:** Register a new admin.  
  **Input:** Admin details (name, email, password).

- `POST /api/v1/users/login`  
  **Description:** Log in with admin credentials.  
  **Input:** Email and password.
   
- `POST /api/v1/users/google`  
  **Description:** Log in with Google oAuth2.  

- `GET /api/v1/assignments`  
  **Description:** View all assignments tagged to the logged-in admin.

- `POST /api/v1/assignments/:id/accept`  
  **Description:** Accept a specific assignment.

- `POST /api/v1/assignments/:id/reject`  
  **Description:** Reject a specific assignment.

---

## 💻 **Tech Stack**

- **Backend Framework:** Node.js, Express.js  
- **Database:** MongoDB  
- **Authentication:** JWT , Google OAuth2 
- **Validation:** Middleware-based input validation  

## 🔧 **Setup and Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Satendra-singh-oos/assignment-submission-portal.git

   cd assignment-submission-portal 
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   
3. **Set up environment variables:**

   ```js
   PORT=8080
   MONGODB_URI=
   CORS_ORIGIN=*
   ACCESS_TOKEN_SECRET=OTUCkcyqgZAaMoogRHVIg9GG
   ACCESS_TOKEN_EXPIRY=10d
   EXPRESS_SESSION_SECRET=7fdOMCFRSLD9cv1k
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   GOOGLE_CALLBACK_URL="http://localhost:8080/api/v1/users/google/callback"
   CLIENT_SSO_REDIRECT_URL=http://localhost:8080/api/v1/users/profile
  
    ```
4. **Run the server:**

     ```
    npm run dev
    ```
-  Check your backend is running on the port http://localhost:${PORT} the PORT you provided on the .env file

