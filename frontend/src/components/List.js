import { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';

const List = ({ list, onAddCard, onCardClick }) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    onAddCard(list._id, newCardTitle.trim());
    setNewCardTitle('');
    setAdding(false);
  };

  return (
    <div className="list-column">
      <h3>{list.title}</h3>
      <Droppable droppableId={list._id}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="card-drop-area">
            {list.cards.map((card, index) => (
              <Card key={card._id} card={card} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {adding ? (
        <form onSubmit={handleAdd} className="add-card-form">
          <input
            autoFocus
            placeholder="Card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
          <div>
            <button type="submit">Add</button>
            <button type="button" className="secondary" onClick={() => setAdding(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>+ Add a card</button>
      )}
    </div>
  );
};

export default List;
