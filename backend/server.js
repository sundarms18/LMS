const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const adminUserRoutes = require('./routes/adminUserRoutes');
const adminCourseRoutes = require('./routes/adminCourseRoutes');
const adminModuleRoutes = require('./routes/adminModuleRoutes');
const adminContentRoutes = require('./routes/adminContentRoutes');
const userCourseRoutes = require('./routes/userCourseRoutes');

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
app.use('/api/admin', adminModuleRoutes);     // Handles /api/admin/courses/:courseId/modules and /api/admin/modules/:moduleId
app.use('/api/admin', adminContentRoutes);   // Handles /api/admin/modules/:moduleId/content and /api/admin/content/:contentId

// User-facing course and content routes
app.use('/api', userCourseRoutes); // Handles /api/courses, /api/courses/:courseId, /api/content/:contentId

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
