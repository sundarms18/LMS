import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import LessonForm from './LessonForm';
import LessonList from './LessonList';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'text';
  content?: string;
  youtubeVideoId?: string;
  duration: number;
  order: number;
}

interface LessonManagementProps {
  moduleId: string;
  lessons: Lesson[];
  onLessonsUpdate: () => void;
}

const LessonManagement: React.FC<LessonManagementProps> = ({ moduleId, lessons, onLessonsUpdate }) => {
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<Lesson>();

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setValue('title', lesson.title);
    setValue('description', lesson.description);
    setValue('type', lesson.type);
    setValue('duration', lesson.duration);
    setValue('content', lesson.content);
    setValue('youtubeVideoId', lesson.youtubeVideoId);
    setShowLessonForm(true);
  };

  const handleCancel = () => {
    setShowLessonForm(false);
    setEditingLesson(null);
    reset();
  };

  const handleDelete = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await axios.delete(`${API_URL}/admin/lessons/${lessonId}`);
        onLessonsUpdate();
      } catch (error) {
        console.error('Error deleting lesson:', error);
        alert('Failed to delete lesson.');
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingLesson) {
        await axios.put(`${API_URL}/admin/lessons/${editingLesson._id}`, data);
      } else {
        await axios.post(`${API_URL}/admin/modules/${moduleId}/lessons`, { ...data, module: moduleId });
      }
      onLessonsUpdate();
      handleCancel();
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Failed to save lesson.');
    }
  };

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">Lessons</h3>
        <button
          onClick={() => {
            setEditingLesson(null);
            reset();
            setShowLessonForm(true);
          }}
          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 flex items-center space-x-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Lesson</span>
        </button>
      </div>

      {showLessonForm && (
        <LessonForm
          onSubmit={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          register={register}
          errors={errors}
          isEditing={!!editingLesson}
          watch={watch}
        />
      )}

      {sortedLessons.length === 0 && !showLessonForm ? (
        <p className="text-gray-500 px-6 py-4">No lessons in this module yet.</p>
      ) : (
        <LessonList
          lessons={sortedLessons}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default LessonManagement;