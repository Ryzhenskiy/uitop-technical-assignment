import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { TaskList, TaskFilter, TaskInput } from './components';
import { useFetch, useUndoableDelete } from './hooks';
import type { Category, Task } from './types';
import './App.css';
import { Spinner } from './components/ui/spinner';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data,
    isLoading: isLoadingTasks,
    error: errorTasks,
    refetch: refetchTasks,
  } = useFetch<Task[]>('/todos', {
    params: {
      category: selectedCategory,
    },
  });

  const {
    data: dataCategories,
    isLoading: isLoadingCategory,
    error: errorCategory,
  } = useFetch<Category[]>('/categories');

  const {
    fetchData: addTaskToServer,
    isLoading: isPosting,
    error: createError,
  } = useFetch<Task[]>(
    '/todos',
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
    false
  );

  const { fetchData: deleteTask } = useFetch<boolean>(
    `/todos`,
    { method: 'DELETE', headers: { 'Content-Type': 'application/json' } },
    false
  );

  const { fetchData: updateTask } = useFetch<Task[]>(
    `/todos`,
    { method: 'PATCH', headers: { 'Content-Type': 'application/json' } },
    false
  );

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const handleAdd = async ({
    title,
    categoryId,
  }: {
    title: string;
    categoryId: number;
  }) => {
    const newTask = { title, categoryId };
    try {
      await addTaskToServer({ data: newTask });
      refetchTasks();
      toast('Todo has been created!');
    } catch (err: unknown) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      }
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await updateTask({ param: id.toString() });
      toast('Todo status has been changed!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask({ param: id.toString() });
      toast('Todo has been deleted!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data.message);
      }
    }
  };
  const { deleteItem: deleteItem } = useUndoableDelete(
    tasks,
    setTasks,
    handleDelete
  );
  const { deleteItem: handleToggleItemUndo } = useUndoableDelete(
    tasks,
    setTasks,
    handleToggle
  );


  return (
    <div className="h-full bg-[#0d1117] text-gray-100 p-6">
      {!isLoadingCategory && !errorCategory && dataCategories ? (
        <TaskFilter
          categories={dataCategories}
          onChangeFilter={(category) => setSelectedCategory(category)}
        />
      ) : (
        <Spinner />
      )}
      <div className="w-full mx-auto">
        {!isLoadingCategory && !errorCategory && dataCategories ? (
          <TaskInput
            categories={dataCategories}
            onAdd={handleAdd}
            isLoading={isPosting}
            error={createError}
          />
        ) : (
          <Spinner />
        )}

        {!isLoadingTasks && !errorTasks && tasks ? (
          <TaskList
            tasks={tasks}
            onToggle={(id) => handleToggleItemUndo(id, false)}
            onDelete={(id) => deleteItem(id)}
          />
        ) : (
          <Spinner />
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
