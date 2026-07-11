import { Draggable } from 'react-beautiful-dnd';

const priorityColor = { low: '#22c55e', medium: '#f59e0b', high: '#ef4444' };

const Card = ({ card, index, onClick }) => (
  <Draggable draggableId={card._id} index={index}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
        onClick={() => onClick(card)}
      >
        <div className="priority-dot" style={{ background: priorityColor[card.priority] }} />
        <p>{card.title}</p>
        {card.dueDate && <span className="due-date">{new Date(card.dueDate).toLocaleDateString()}</span>}
      </div>
    )}
  </Draggable>
);

export default Card;
