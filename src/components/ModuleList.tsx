import React from 'react';
import { Edit, Trash } from 'lucide-react';

interface Module {
  _id: string;
  title: string;
  description: string;
}

interface ModuleListProps {
  modules: Module[];
  onEdit: (module: Module) => void;
  onDelete: (moduleId: string) => void;
  onSelectModule: (moduleId: string) => void;
  selectedModuleId?: string | null;
}

const ModuleList: React.FC<ModuleListProps> = ({ modules, onEdit, onDelete, onSelectModule, selectedModuleId }) => {
  return (
    <div className="space-y-4">
      {modules.map((module) => (
        <div
          key={module._id}
          className={`border rounded-lg overflow-hidden transition-all duration-200 ${selectedModuleId === module._id ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
        >
          <div
            className="bg-gray-50 px-6 py-4 cursor-pointer hover:bg-gray-100"
            onClick={() => onSelectModule(module._id)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
                <p className="text-gray-600 mt-1">{module.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(module);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit Module"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(module._id);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Module"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ModuleList;