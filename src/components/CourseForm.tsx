import React from 'react';
import { UseFormRegister } from 'react-hook-form';

interface Course {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
}

interface CourseFormProps {
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  register: UseFormRegister<any>;
  editingCourse: Course | null;
}

const CourseForm: React.FC<CourseFormProps> = ({
  onSubmit,
  onCancel,
  register,
  editingCourse,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {editingCourse ? 'Edit Course' : 'Create New Course'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            {...register('title', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Course title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description', { required: true })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Course description"
          />
        </div>
        <div className="flex items-center">
          <input
            {...register('isPublished')}
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-700">Published</label>
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {editingCourse ? 'Update' : 'Create'} Course
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;