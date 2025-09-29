import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import ModuleForm from './ModuleForm';
import ModuleList from './ModuleList';
import LessonManagement from './LessonManagement';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'text';
  duration: number;
  order: number;
}

interface Module {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface ModuleManagementProps {
  courseId: string;
  modules: Module[];
  onModulesUpdate: () => void; // To refetch course data in the parent
}

const ModuleManagement: React.FC<ModuleManagementProps> = ({ courseId, modules, onModulesUpdate }) => {
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Module>();

  const handleSelectModule = (moduleId: string) => {
    setSelectedModuleId(prevId => (prevId === moduleId ? null : moduleId));
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setValue('title', module.title);
    setValue('description', module.description);
    setShowModuleForm(true);
  };

  const handleCancel = () => {
    setShowModuleForm(false);
    setEditingModule(null);
    reset();
  };

  const handleDelete = async (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module and all its lessons?')) {
      try {
        await axios.delete(`${API_URL}/admin/modules/${moduleId}`);
        onModulesUpdate();
      } catch (error) {
        console.error('Error deleting module:', error);
        alert('Failed to delete module.');
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingModule) {
        await axios.put(`${API_URL}/admin/modules/${editingModule._id}`, data);
      } else {
        await axios.post(`${API_URL}/admin/courses/${courseId}/modules`, { ...data, course: courseId });
      }
      onModulesUpdate();
      handleCancel();
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Failed to save module.');
    }
  };

  const selectedModule = modules.find(m => m._id === selectedModuleId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
        <button
          onClick={() => {
            setEditingModule(null);
            reset();
            setShowModuleForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Module</span>
        </button>
      </div>

      {showModuleForm && (
        <ModuleForm
          onSubmit={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          register={register}
          errors={errors}
          isEditing={!!editingModule}
        />
      )}

      {modules.length === 0 && !showModuleForm ? (
        <p className="text-gray-500">No modules available yet. Click "Add Module" to get started.</p>
      ) : (
        <ModuleList
          modules={modules}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSelectModule={handleSelectModule}
          selectedModuleId={selectedModuleId}
        />
      )}

      {selectedModule && (
        <div className="mt-6 pl-6 border-l-4 border-blue-500">
          <LessonManagement
            moduleId={selectedModule._id}
            lessons={selectedModule.lessons}
            onLessonsUpdate={onModulesUpdate}
          />
        </div>
      )}
    </div>
  );
};

export default ModuleManagement;