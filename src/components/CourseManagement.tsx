import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import CourseForm from './CourseForm';
import CourseList from './CourseList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  isPublished: boolean;
  instructor: {
    name: string;
  };
  enrollmentCount: number;
}

interface CourseManagementProps {
  onViewCourseProgress: (courseId: string) => void;
  courses: Course[];
  fetchCourses: () => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ onViewCourseProgress, courses, fetchCourses }) => {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const onSubmitCourse = async (data: any) => {
    try {
      if (editingCourse) {
        await axios.put(`${API_URL}/admin/courses/${editingCourse._id}`, data);
      } else {
        await axios.post(`${API_URL}/admin/courses`, data);
      }

      reset();
      setShowCourseForm(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const editCourse = (course: Course) => {
    setEditingCourse(course);
    setValue('title', course.title);
    setValue('description', course.description);
    setValue('isPublished', course.isPublished);
    setShowCourseForm(true);
  };

  const deleteCourse = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${API_URL}/admin/courses/${courseId}`);
        fetchCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleCancelForm = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {showCourseForm && (
        <CourseForm
          onSubmit={handleSubmit(onSubmitCourse)}
          onCancel={handleCancelForm}
          register={register}
          editingCourse={editingCourse}
        />
      )}

      <CourseList
        courses={courses}
        onAddNewCourse={() => setShowCourseForm(true)}
        onEditCourse={editCourse}
        onDeleteCourse={deleteCourse}
        onViewCourseProgress={onViewCourseProgress}
      />
    </div>
  );
};

export default CourseManagement;