import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Learn Without Limits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover a world of knowledge with our comprehensive learning management system. 
              Start your journey today and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Explore Courses</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all duration-200"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LearnHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to provide the best learning experience with powerful features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rich Content</h3>
              <p className="text-gray-600 leading-relaxed">
                Access high-quality video lessons, interactive content, and comprehensive learning materials 
                crafted by expert instructors.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Join a vibrant community of learners and instructors. Collaborate, share knowledge, 
                and grow together in your learning journey.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your learning progress with detailed analytics, completion tracking, 
                and personalized learning paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners who are already advancing their careers with LearnHub.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 inline-flex items-center space-x-2"
          >
            <span>Create Your Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;