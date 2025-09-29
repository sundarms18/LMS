import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface LessonFormProps {
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isEditing: boolean;
}

const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, onCancel, register, errors, isEditing }) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-inner p-6 my-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit Lesson' : 'Create New Lesson'}
      </h4>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Lesson title"
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message as string}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={2}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Lesson description"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              {...register('type')}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              {...register('duration', { required: 'Duration is required', valueAsNumber: true })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 10"
            />
            {errors.duration && <p className="text-sm text-red-600 mt-1">{errors.duration.message as string}</p>}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEditing ? 'Update Lesson' : 'Create Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LessonForm;