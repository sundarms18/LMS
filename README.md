# Learning Management System (LMS)

A full-stack Learning Management System built with React, Node.js, Express, and MongoDB. Features include user management, course creation, enrollment workflows, and progress tracking.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication with access and refresh tokens
- Role-based access control (Admin/User)
- Two-tier approval system (User approval + Enrollment approval)
- Secure password hashing with bcrypt

### User Management
- User registration with pending approval status
- Admin can approve/reject user registrations
- User profile management

### Course Management
- Full CRUD operations for courses, modules, and lessons
- Support for video (YouTube) and text lessons
- Course publishing system
- Module and lesson ordering

### Enrollment System
- Course enrollment requests
- Admin approval for enrollments
- Enrollment status tracking (pending, active, rejected, completed)

### Progress Tracking
- Lesson completion tracking
- Module and course progress calculation
- User dashboard with progress visualization
- Admin progress monitoring

### Admin Dashboard
- User management (approve/reject registrations)
- Course and content management
- Enrollment management
- Progress tracking and analytics

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Hook Form** for form handling
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Joi** for validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lms-system
   ```

2. **Install dependencies**
   ```bash
   # Install main dependencies
   npm install

   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Configuration**
   
   Create `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   Create `.env` file in the server directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Database Setup**
   
   Start MongoDB service locally or use MongoDB Atlas.
   
   Run the seed script to create initial data:
   ```bash
   npm run server:seed
   ```
   
   This creates:
   - Admin user: `admin@example.com` / `admin123`
   - Active user: `john@example.com` / `password123`
   - Pending user: `jane@example.com` / `password123`
   - Sample course with modules and lessons
   - Sample enrollment

5. **Start Development Servers**
   ```bash
   npm run dev
   ```
   
   This starts both frontend (http://localhost:5173) and backend (http://localhost:5000).

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Course Endpoints
- `GET /api/courses` - Get published courses
- `GET /api/courses/:slug` - Get course details
- `POST /api/courses/:courseId/enroll` - Request enrollment

### Admin Endpoints
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/approve` - Approve user
- `PATCH /api/admin/users/:id/reject` - Reject user
- `GET /api/admin/courses` - Get all courses (admin)
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/enrollments` - Get all enrollments
- `PATCH /api/admin/enrollments/:id/approve` - Approve enrollment
- `PATCH /api/admin/enrollments/:id/reject` - Reject enrollment

### Progress Tracking
- `POST /api/enrollments/:enrollmentId/lessons/:lessonId/complete` - Mark lesson complete
- `GET /api/users/:userId/enrollments` - Get user enrollments

## 🎯 User Flows

### New User Registration Flow
1. User registers with email/password
2. Account created with `pending` status
3. Admin reviews and approves/rejects the account
4. User can login after approval

### Course Enrollment Flow
1. User browses available courses
2. User requests enrollment in a course
3. Enrollment created with `pending` status
4. Admin approves/rejects the enrollment request
5. User can access course content after approval

### Learning Flow
1. User accesses enrolled course
2. User views lessons (video/text)
3. User marks lessons as complete
4. Progress is automatically calculated
5. Course completion is tracked

## 🔒 Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT tokens with expiration
- Rate limiting on login endpoint (5 attempts per 15 minutes)
- CORS configuration
- Helmet for security headers
- Input validation with Joi
- Role-based access control
- Protected video content access

## 🧪 Testing

Run tests:
```bash
npm test
```

The test suite includes:
- Authentication tests
- Course management tests
- Enrollment workflow tests
- Progress tracking tests

## 📱 Frontend Pages

### Public Pages
- **Home** - Landing page with hero section and features
- **Course List** - Browse available courses
- **Course Detail** - View course information and enroll
- **Login/Register** - Authentication forms

### Protected Pages
- **Dashboard** - User dashboard with enrollments and progress
- **Lesson View** - Watch videos or read content
- **Admin Dashboard** - Complete admin interface

### Admin Features
- User management (approve/reject)
- Course CRUD operations
- Enrollment management
- Progress monitoring
- Analytics dashboard

## 🎨 Design Features

- Responsive design (mobile-first)
- Modern UI with Tailwind CSS
- Smooth animations and transitions
- Intuitive navigation
- Progress indicators
- Status badges and notifications
- Loading states and error handling

## 🚀 Deployment

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update `MONGO_URI` in server `.env`

### Environment Variables for Production
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lms
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, Heroku, or any Node.js hosting
- **Database**: MongoDB Atlas (recommended)

## 🔧 Development

### File Structure
```
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── contexts/           # React contexts
│   ├── pages/              # Page components
│   └── main.tsx           # App entry point
├── server/                 # Backend Express app
│   ├── src/
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── validators/     # Input validation
│   │   └── scripts/        # Utility scripts
│   └── __tests__/          # Test files
└── README.md
```

### Code Quality
- ESLint configuration
- TypeScript for type safety
- Consistent error handling
- Input validation
- Modular architecture

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using React, Node.js, and MongoDB