# Online Learning Platform Backend

## 🎓 Project Overview

This platform is a comprehensive online learning platform backend that facilitates interaction between students, instructors, and administrators. The system manages course enrollments, instructor applications, reviews, and payments.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **File Upload**: Multer
- **Email Service**: Nodemailer
- **Input Validation**: Validator.js
- **Password Hashing**: Bcrypt

## 🏗 Project Structure

```
backend/
├── config/               # Configuration files
├── controllers/         # Business logic
├── database/           # Database configuration
├── middleware/         # Custom middleware
├── models/            # MongoDB schemas
├── routes/            # API routes
└── uploads/           # File storage
```

## 🔑 Core Features

### User Management
- Multi-role authentication (Admin/Instructor/Student)
- Email verification
- Password reset functionality
- Profile management

### Course Management
- Course creation and modification
- Category organization
- Rating and review system
- Course enrollment tracking

### Instructor Features
- Application process
- CV upload and management
- Course assignment
- Archive/restore functionality

### Payment System
- Installment-based payments
- Payment tracking
- Transaction history

### Statistics
- Course analytics
- User metrics
- Enrollment statistics

## 📡 API Endpoints

### Authentication
```
POST /auth/signIn          # User login
POST /auth/siginAdmin      # Admin login
POST /auth/forget-password # Password reset request
POST /auth/reset-password  # Reset password
```

### User Management
```
POST   /condidat/signup    # Student registration
POST   /formateur/signup   # Instructor registration
PUT    /admin/editProfil   # Update admin profile
```

### Courses
```
POST   /formation/addFormation      # Create course
GET    /formation/getAll            # List all courses
PUT    /formation/updateFormation   # Update course
DELETE /formation/supprimerFormation # Delete course
```

### Categories
```
POST   /categorie/addCategorie      # Create category
GET    /categorie/getCategories     # List categories
PUT    /categorie/updateCategorie   # Update category
DELETE /categorie/supprimerCatgorie # Delete category
```

### Reviews & Ratings
```
POST   /formation/addAvis           # Add review
GET    /formation/getAllReveiws     # Get all reviews
PUT    /formation/AccepterReview    # Approve review
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Email verification
- Protected routes
- Input validation

## 💾 Database Models

### Core Models
- User (Admin/Instructor/Student)
- Course
- Category
- Session
- Payment
- Review

### Relationship Models
- Course Enrollments
- Instructor Applications
- Payment Transactions

## 📬 Email Features

- Welcome emails
- Verification emails
- Password reset emails
- Status update notifications



2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Create config/.env file with:
TOKEN_SECRET=your_jwt_secret
LIVE_URL=http://localhost:4200/user/
```

4. **Start the server**
```bash
npm start
```

## 📝 Environment Variables

```env
TOKEN_SECRET=jwt_secret_key
LIVE_URL=frontend_url
```

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens expire after 1 hour
- File uploads are restricted by size and type
- Email verification required for new accounts
- Protected routes with role-based access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request



## 👥 Authors

- Mohamed ismail Ben Alaya

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- Node.js community
