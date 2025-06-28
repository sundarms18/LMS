const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');

// Import Mongoose Models
const User = require('../models/User');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Content = require('../models/Content');
const Enrollment = require('../models/Enrollment');
const UserProgress = require('../models/UserProgress');

// @desc    Seed the database with a comprehensive set of dummy data
// @route   POST /api/dev/seed-database
// @access  Development only
router.post('/seed-database', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'This endpoint is only available in development mode.' });
  }

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Module.deleteMany({});
    await Content.deleteMany({});
    await Enrollment.deleteMany({});
    await UserProgress.deleteMany({});
    console.log('Existing data cleared successfully.');

    // --- Password Hashing ---
    console.log('Hashing password...');
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash('Pass@123', salt);
    console.log('Password hashed.');

    // --- Create Users ---
    console.log('Creating users...');
    const adminUser = await User.create({ name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin', isApproved: true });
    const user1 = await User.create({ name: 'User One (Alice)', email: 'user1@example.com', password: hashedPassword, role: 'user', isApproved: true });
    const user2 = await User.create({ name: 'User Two (Bob)', email: 'user2@example.com', password: hashedPassword, role: 'user', isApproved: true });
    const user3 = await User.create({ name: 'User Three (Charlie)', email: 'user3@example.com', password: hashedPassword, role: 'user', isApproved: false }); // Pending approval
    console.log('Users created.');

    // --- Create Courses, Modules, and Content ---
    console.log('Creating courses, modules, and content...');

    // Course 1: Introduction to Web Development
    const course1 = await Course.create({ title: 'Introduction to Web Development', description: 'Learn the fundamentals of web development, including HTML, CSS, and basic JavaScript.', instructor: adminUser._id, isPublished: true });

    const module1_1 = await Module.create({ title: 'HTML Basics', description: 'Understanding HTML structure, elements, and semantic markup.' });
    const content1_1_1 = await Content.create({ title: 'Introduction to HTML', type: 'text', text_content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages and web applications. This section covers the basic structure of an HTML document, common tags like headings, paragraphs, links, images, and lists.', course: course1._id });
    const content1_1_2 = await Content.create({ title: 'HTML Elements & Attributes', type: 'text', text_content: 'Dive deeper into HTML elements, understanding block vs. inline elements, and how attributes modify them. Learn about semantic HTML5 tags like <article>, <section>, <nav>, and <footer>.', course: course1._id });
    const content1_1_3 = await Content.create({ title: 'HTML Crash Course Video', type: 'video', url: 'rokGy0huYEA', course: course1._id }); // Example: Traversy Media HTML Crash Course
    module1_1.content.push(content1_1_1._id, content1_1_2._id, content1_1_3._id);
    await module1_1.save();

    const module1_2 = await Module.create({ title: 'CSS Fundamentals', description: 'Styling web pages with CSS for a pleasant user experience.' });
    const content1_2_1 = await Content.create({ title: 'CSS Selectors & Properties', type: 'text', text_content: 'Learn how CSS selectors target HTML elements and how various CSS properties can be applied to change their appearance, layout, and more. Covers colors, fonts, spacing, and the box model.', course: course1._id });
    const content1_2_2 = await Content.create({ title: 'Introduction to Flexbox', type: 'text', text_content: 'Flexbox is a one-dimensional layout model that offers an efficient way to lay out, align, and distribute space among items in a container, even when their size is unknown or dynamic.', course: course1._id });
    const content1_2_3 = await Content.create({ title: 'CSS Crash Course Video', type: 'video', url: 'ServCt24Jqo', course: course1._id }); // Example: DesignCourse CSS Crash Course
    module1_2.content.push(content1_2_1._id, content1_2_2._id, content1_2_3._id);
    await module1_2.save();

    course1.modules.push(module1_1._id, module1_2._id);
    await course1.save();
    console.log('Course 1 created.');

    // Course 2: Advanced JavaScript
    const course2 = await Course.create({ title: 'Advanced JavaScript', description: 'Deep dive into advanced JavaScript concepts like asynchronous programming, closures, and design patterns.', instructor: adminUser._id, isPublished: true });

    const module2_1 = await Module.create({ title: 'Asynchronous JavaScript', description: 'Understanding callbacks, Promises, and Async/Await for non-blocking operations.' });
    const content2_1_1 = await Content.create({ title: 'Promises Explained', type: 'text', text_content: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation. It allows you to associate handlers with an asynchronous action\'s eventual success value or failure reason.', course: course2._id });
    const content2_1_2 = await Content.create({ title: 'Async/Await Syntax', type: 'text', text_content: 'Async/await is syntactic sugar built on top of Promises, making asynchronous code look and behave a bit more like synchronous code, which helps in writing cleaner and more readable async operations.', course: course2._id });
    const content2_1_3 = await Content.create({ title: 'Async JS Full Tutorial', type: 'video', url: 'KnotenbE_3Oc', course: course2._id }); // Example: Net Ninja Async JS
    module2_1.content.push(content2_1_1._id, content2_1_2._id, content2_1_3._id);
    await module2_1.save();

    const module2_2 = await Module.create({ title: 'JavaScript Design Patterns', description: 'Exploring common reusable solutions to commonly occurring problems within a given context in software design.' });
    const content2_2_1 = await Content.create({ title: 'Module Pattern', type: 'text', text_content: 'The Module pattern is used to keep pieces of code independent of other components. This provides loose coupling to support well-structured code.', course: course2._id });
    const content2_2_2 = await Content.create({ title: 'Observer Pattern', type: 'text', text_content: 'The Observer pattern is a software design pattern in which an object, named the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods.', course: course2._id });
    module2_2.content.push(content2_2_1._id, content2_2_2._id);
    await module2_2.save();

    course2.modules.push(module2_1._id, module2_2._id);
    await course2.save();
    console.log('Course 2 created.');

    // Course 3: React Deep Dive (Not Published initially)
    const course3 = await Course.create({ title: 'React Deep Dive', description: 'Advanced React concepts including Hooks, Context API, and performance optimization.', instructor: adminUser._id, isPublished: false });

    const module3_1 = await Module.create({ title: 'React Hooks In-Depth', description: 'Exploring useState, useEffect, useContext, useReducer, useCallback, and useMemo.' });
    const content3_1_1 = await Content.create({ title: 'Understanding useEffect Dependencies', type: 'text', text_content: 'The dependency array in useEffect tells React when to re-run the effect. Properly managing dependencies is crucial for performance and correctness.', course: course3._id });
    const content3_1_2 = await Content.create({ title: 'Custom Hooks', type: 'text', text_content: 'Custom Hooks allow you to extract component logic into reusable functions. Learn how to build your own custom Hooks.', course: course3._id });
    module3_1.content.push(content3_1_1._id, content3_1_2._id);
    await module3_1.save();

    course3.modules.push(module3_1._id);
    await course3.save();
    console.log('Course 3 created.');
    console.log('Courses, modules, and content created.');

    // --- Create Enrollment Records ---
    console.log('Creating enrollment records...');
    await Enrollment.create({ userId: user1._id, courseId: course1._id, status: 'approved' });
    await Enrollment.create({ userId: user1._id, courseId: course2._id, status: 'approved' });
    await Enrollment.create({ userId: user2._id, courseId: course1._id, status: 'pending' });
    await Enrollment.create({ userId: user2._id, courseId: course2._id, status: 'approved' }); // User 2 approved for course 2
    await Enrollment.create({ userId: user3._id, courseId: course1._id, status: 'pending' }); // User 3 (pending approval) requests course 1
    await Enrollment.create({ userId: user3._id, courseId: course3._id, status: 'pending' }); // User 3 requests course 3 (which is not published)
    console.log('Enrollment records created.');

    // --- Create User Progress Records ---
    console.log('Creating user progress records...');
    // User 1 progress in Course 1
    await UserProgress.create({ userId: user1._id, courseId: course1._id, contentId: content1_1_1._id, completed: true });
    await UserProgress.create({ userId: user1._id, courseId: course1._id, contentId: content1_1_2._id, completed: true });
    await UserProgress.create({ userId: user1._id, courseId: course1._id, contentId: content1_1_3._id, completed: false }); // Video started but not marked complete
    // User 1 progress in Course 2
    await UserProgress.create({ userId: user1._id, courseId: course2._id, contentId: content2_1_1._id, completed: true });
    // User 2 progress in Course 2
    await UserProgress.create({ userId: user2._id, courseId: course2._id, contentId: content2_1_1._id, completed: false });
    await UserProgress.create({ userId: user2._id, courseId: course2._id, contentId: content2_1_2._id, completed: true });
    console.log('User progress records created.');

    res.status(201).json({ message: 'Database seeded successfully with comprehensive dummy data.' });

  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ message: 'Failed to seed database.', error: error.message, stack: error.stack });
  }
});

module.exports = router;
