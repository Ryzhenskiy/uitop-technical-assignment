import React, { useState } from 'react';
import type { Category } from '../types';
import { Filter } from 'lucide-react';

const TaskFilter: React.FC<{
  categories: Category[];
  onChangeFilter: (category: string | null) => void;
}> = ({ categories, onChangeFilter }) => {
  const [category, setCategory] = useState<Category | null>(null);

  return (
    <div className="flex items-center gap-3 mb-5">
      <label className="flex items-center gap-2 text-gray-300 text-sm font-medium">
        <Filter size={16} className="text-gray-400" />
        <span>Filter by category:</span>
      </label>

      <div className="relative">
        <select
          value={category?.id ?? ''}
          onChange={(e) => {
            const value = e.target.value;

            if (value === '') {
              setCategory(null);
              onChangeFilter(null);
            } else {
              const selected = categories.find(
                (c) => c.id === +value
              ) as Category;
              setCategory(selected);
              onChangeFilter(selected.name);
            }
          }}
          className="appearance-none bg-[#161b22] border border-gray-700 text-gray-200 text-sm rounded-xl px-4 py-2 pr-8
                     focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-150 cursor-pointer
                     hover:border-gray-500 shadow-sm"
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id} className="bg-[#161b22]">
              {cat.name}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          ▼
        </span>
      </div>
    </div>
  );
};

export default TaskFilter;
