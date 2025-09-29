import React from 'react';
import { Plus, CreditCard as Edit, Trash, Eye } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  instructor: {
    name: string;
  };
  enrollmentCount: number;
}

interface CourseListProps {
  courses: Course[];
  onAddNewCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  onViewCourseProgress: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  onAddNewCourse,
  onEditCourse,
  onDeleteCourse,
  onViewCourseProgress,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-6 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
        <button
          onClick={onAddNewCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Course</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{course.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.instructor.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.enrollmentCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditCourse(course)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit Course"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onViewCourseProgress(course._id)}
                      className="text-green-600 hover:text-green-900"
                      title="View Progress"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteCourse(course._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Course"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;