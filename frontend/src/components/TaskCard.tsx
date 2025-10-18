import { Check, Trash2 } from "lucide-react";
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 mb-2 rounded-2xl transition-all border 
      ${
        task.completed
          ? "bg-[#1b1f24] border-gray-700 opacity-70"
          : "bg-[#161b22] border-gray-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 flex items-center justify-center rounded-full border
            ${
              task.completed
                ? "border-blue-500 bg-blue-600 text-white"
                : "border-gray-600 text-gray-400 hover:border-blue-500"
            }`}
        >
          {task.completed && <Check size={14} />}
        </button>
        <span
          className={`text-sm ${
            task.completed
              ? "text-gray-500 line-through"
              : "text-gray-100"
          }`}
        >
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
          {task.category.name}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
