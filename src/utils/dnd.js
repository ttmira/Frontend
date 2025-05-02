import { useDrag, useDrop } from 'react-dnd';

export const ItemTypes = {
  TASK: 'task',
  COLUMN: 'column'
};

export const useColumnDrag = (columnId, index, ref) => {
  return useDrag({
    type: ItemTypes.COLUMN,
    item: { 
      type: ItemTypes.COLUMN, 
      id: columnId, 
      index 
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
};

export const useColumnDrop = (ref, index, onDrop) => {
  return useDrop({
    accept: ItemTypes.COLUMN,
    hover(item, monitor) {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      item.hoverIndex = hoverIndex;
      if (item.index !== hoverIndex) {
        onDrop(dragIndex, hoverIndex);
      }
    },
    drop(item) {
      return { index: item.index };
    }
  });
};

export const useTaskDrag = (item, ref, onDragEnd) => {
  return useDrag({
    type: ItemTypes.TASK,
    item: () => ({
      ...item,
      type: ItemTypes.TASK
    }),
    end: (draggedItem, monitor) => {
      if (!monitor.didDrop() || !onDragEnd) return;
      
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        onDragEnd({
          taskId: draggedItem.id,
          sourceColumnId: draggedItem.columnId,
          destinationColumnId: dropResult.columnId,
          sourceIndex: draggedItem.index,
          destinationIndex: dropResult.index
        });
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
};

export const useTaskDrop = (columnId, index, ref, onMoveTask) => {
  return useDrop({
    accept: ItemTypes.TASK,
    drop: () => ({
      columnId,
      index
    }),
    hover: (item, monitor) => {
      if (!ref.current || !onMoveTask) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceColumnId = item.columnId;
      const hoverColumnId = columnId;

      if (dragIndex === hoverIndex && sourceColumnId === hoverColumnId) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMoveTask({
        taskId: item.id,
        sourceColumnId,
        destinationColumnId: hoverColumnId,
        sourceIndex: dragIndex,
        destinationIndex: hoverIndex
      });
      item.index = hoverIndex;
      item.columnId = hoverColumnId;
    }
  });
};



     

