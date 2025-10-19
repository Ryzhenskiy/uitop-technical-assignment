import TaskCard from './TaskCard';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <div className="mt-2 space-y-2">

      {tasks.length === 0 && (
        <p className="text-gray-500 text-center">No tasks available.</p>
      )}
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
