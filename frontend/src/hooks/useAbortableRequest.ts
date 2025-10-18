import { useRef } from 'react';
import { toast } from 'sonner';

interface Item {
  id: number | string;
  completed: boolean;
  [key: string]: any;
}

interface UndoRecord<T> {
  timeoutId: ReturnType<typeof setTimeout>;
  deletedItem: T;
  deletedItemIdx: number;
}

interface UseUndoableDeleteReturn<T extends Item> {
  deleteItem: (id: T['id'], isJustDelete?: boolean) => void;
  undoDelete: (id: T['id']) => void;
}

function useUndoableDelete<T extends Item>(
  items: T[],
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
  requestDelete: (id: any) => Promise<void>
): UseUndoableDeleteReturn<T> {
  const deleteTimeouts = useRef<Record<string | number, UndoRecord<T>>>({});
  const undoDelete = (id: T['id'], isJustDelete = true) => {
    const record = deleteTimeouts.current[id];
    if (record) {
      clearTimeout(record.timeoutId);

      setItems((prev) => {
        if (isJustDelete) {
          return [...prev, record.deletedItem];
        } else {
          prev[record.deletedItemIdx].completed = false;
          return [...prev];
        }
      });
      delete deleteTimeouts.current[id];
    }
  };
  const deleteItem = (id: T['id'], isJustDelete = true) => {
    const deletedItemIdx = items.findIndex((i) =>
      isJustDelete ? i.id === id : i.id === id && !i.completed
    );
    const deletedItem = items[deletedItemIdx];
    if (!deletedItem) return;

    // Optimistically remove item
    setItems((prev) => {
      if (isJustDelete) {
        return prev.filter((el) => el.id !== deletedItem.id);
      } else {
        console.log('before', prev[deletedItemIdx].completed);
        prev[deletedItemIdx].completed = true;
        console.log('after', prev[deletedItemIdx].completed);
        return [...prev];
      }
    });
    toast(isJustDelete ? 'Item deleted' : 'Item updated status completed', {
      action: {
        label: 'Undo',
        onClick: () => {
          console.log('Undo clicked');
          undoDelete(id, isJustDelete);
        },
      },
    });

    // Schedule real delete after 5s
    const timeoutId = setTimeout(async () => {
      try {
        await requestDelete(id);
        setItems((prev) => prev.filter((el) => el.id !== id));
      } catch (err: unknown) {
        console.error('Delete failed:', err);
      } finally {
        delete deleteTimeouts.current[id];
      }
    }, 5000);

    // Store undo record
    deleteTimeouts.current[id] = { timeoutId, deletedItem, deletedItemIdx };
  };

  return { deleteItem, undoDelete };
}

export default useUndoableDelete;
