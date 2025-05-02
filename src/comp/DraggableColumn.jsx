import React from 'react';
import { useDrag } from 'react-dnd';
import Column from './Column';
import { ItemTypes } from '../utils/dnd';

const DraggableColumn = React.memo(({ boardId, column, index, onDelCol }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COLUMN,
    item: { 
      type: ItemTypes.COLUMN,
      id: column.id,
      index,
      hoverIndex: index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        marginRight: '10px' 
      }}
    >
      <Column
        boardId={boardId}
        column={column}
        index={index}
        onDelCol={onDelCol}
      />
    </div>
  );
});

export default DraggableColumn;