import React from 'react';
import { Edit, Trash, FileText, Play } from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'text';
  duration: number;
}

interface LessonListProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({ lessons, onEdit, onDelete }) => {
  return (
    <div className="divide-y divide-gray-200">
      {lessons.map((lesson) => (
        <div key={lesson._id} className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {lesson.type === 'video' ? (
              <Play className="h-5 w-5 text-blue-600" />
            ) : (
              <FileText className="h-5 w-5 text-green-600" />
            )}
            <div>
              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
              <p className="text-sm text-gray-600">{lesson.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{lesson.duration} min</span>
            <button
              onClick={() => onEdit(lesson)}
              className="text-blue-600 hover:text-blue-800"
              title="Edit Lesson"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(lesson._id)}
              className="text-red-600 hover:text-red-800"
              title="Delete Lesson"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LessonList;