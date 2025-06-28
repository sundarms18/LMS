const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const adminUserRoutes = require('./routes/adminUserRoutes');
const adminCourseRoutes = require('./routes/adminCourseRoutes');
const adminModuleRoutes = require('./routes/adminModuleRoutes');
const adminContentRoutes = require('./routes/adminContentRoutes');
const userCourseRoutes = require('./routes/userCourseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes'); // Import user enrollment routes
const adminEnrollmentRoutes = require('./routes/adminEnrollmentRoutes'); // Import admin enrollment routes
const progressRoutes = require('./routes/progressRoutes'); // Import user progress routes
const adminProgressRoutes = require('./routes/adminProgressRoutes'); // Import admin progress routes
const devRoutes = require('./routes/devRoutes'); // Import dev routes for seeding

dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Auth routes
app.use('/api/auth', authRoutes);

// Admin routes
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/courses', adminCourseRoutes); // Handles /api/admin/courses and /api/admin/courses/:courseId
app.use('/api/admin/modules', adminModuleRoutes);     // Handles /api/admin/courses/:courseId/modules and /api/admin/modules/:moduleId
app.use('/api/admin/content', adminContentRoutes);   // Handles /api/admin/modules/:moduleId/content and /api/admin/content/:contentId
app.use('/api/admin/enrollments', adminEnrollmentRoutes); // Mount admin enrollment routes

// User-facing course and content routes
app.use('/api/courses', userCourseRoutes); // Handles /api/courses, /api/courses/:courseId, /api/content/:contentId
app.use('/api/enroll', enrollmentRoutes); // Mount user enrollment routes
app.use('/api/progress', progressRoutes); // Mount user progress routes

// Admin routes (continued)
app.use('/api/admin/progress', adminProgressRoutes); // Mount admin progress routes

// Development routes (e.g., for seeding)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/dev', devRoutes);
}

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
