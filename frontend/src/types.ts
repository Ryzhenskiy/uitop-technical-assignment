export interface Category {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  category: Category;
}
