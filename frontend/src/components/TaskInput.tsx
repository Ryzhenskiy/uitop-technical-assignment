import { Plus } from 'lucide-react';
import type { Category } from '../types';
import { useForm, Controller } from 'react-hook-form';

interface TaskInputProps {
  categories: Category[];
  onAdd: (task: { title: string; categoryId: number }) => void;
}

interface FormValues {
  title: string;
  categoryId: number;
}

export default function TaskInput({ categories, onAdd }: TaskInputProps) {
  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      title: '',
      categoryId: categories[0]?.id || 0,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!data.title.trim()) return;
    onAdd({ title: data.title, categoryId: data.categoryId });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-3 bg-[#161b22] border border-gray-800 p-3 rounded-2xl mb-4"
    >
      <input
        {...register('title', { required: true })}
        type="text"
        placeholder="Enter new task..."
        className="flex-1 bg-transparent text-gray-100 outline-none placeholder-gray-500"
      />
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => (
          <select
            {...field}
            value={field.value}
            onChange={(e) => field.onChange(+e.target.value)}
            className="bg-[#0d1117] border border-gray-700 text-gray-300 text-sm px-2 py-1 rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0d1117]">
                {cat.name}
              </option>
            ))}
          </select>
        )}
      />
      <button
        type="submit"
        className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white text-sm"
      >
        <Plus size={24} />
      </button>
    </form>
  );
}
