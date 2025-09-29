import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ModuleFormProps {
  onSubmit: (e: React.BaseSyntheticEvent) => void;
  onCancel: () => void;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  isEditing: boolean;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ onSubmit, onCancel, register, errors, isEditing }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 my-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        {isEditing ? 'Edit Module' : 'Create New Module'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Module title"
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
            rows={3}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Module description"
          />
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
            {isEditing ? 'Update Module' : 'Create Module'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModuleForm;