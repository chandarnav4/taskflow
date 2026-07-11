import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';
import api from '../api';
import List from '../components/List';
import CardModal from '../components/CardModal';

const BoardView = () => {
  const { id: boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [activeCard, setActiveCard] = useState(null);

  const fetchBoard = useCallback(async () => {
    const { data } = await api.get(`/boards/${boardId}`);
    setBoard(data);
  }, [boardId]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    await api.post('/lists', { title: newListTitle.trim(), boardId });
    setNewListTitle('');
    fetchBoard();
  };

  const handleAddCard = async (listId, title) => {
    await api.post('/cards', { title, listId });
    fetchBoard();
  };

  const handleCardSave = async (cardId, updates) => {
    await api.put(`/cards/${cardId}`, updates);
    fetchBoard();
  };

  const handleCardDelete = async (cardId) => {
    await api.delete(`/cards/${cardId}`);
    fetchBoard();
  };

  // Called by react-beautiful-dnd when a drag ends
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI update: move the card locally first
    setBoard((prev) => {
      const lists = prev.lists.map((l) => ({ ...l, cards: [...l.cards] }));
      const sourceList = lists.find((l) => l._id === source.droppableId);
      const destList = lists.find((l) => l._id === destination.droppableId);
      const [moved] = sourceList.cards.splice(source.index, 1);
      destList.cards.splice(destination.index, 0, moved);
      return { ...prev, lists };
    });

    try {
      await api.patch(`/cards/${draggableId}/move`, {
        toListId: destination.droppableId,
        newOrder: destination.index,
      });
    } catch (err) {
      // Roll back to server state on failure
      fetchBoard();
    }
  };

  if (!board) return <p className="container">Loading board...</p>;

  return (
    <div className="board-view">
      <div className="board-header">
        <Link to="/boards">&larr; Boards</Link>
        <h2>{board.title}</h2>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board-lists">
          {board.lists.map((list) => (
            <List key={list._id} list={list} onAddCard={handleAddCard} onCardClick={setActiveCard} />
          ))}

          <form onSubmit={handleAddList} className="add-list-form">
            <input
              placeholder="+ Add another list"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </form>
        </div>
      </DragDropContext>

      {activeCard && (
        <CardModal
          card={activeCard}
          onClose={() => setActiveCard(null)}
          onSave={handleCardSave}
          onDelete={handleCardDelete}
        />
      )}
    </div>
  );
};

export default BoardView;
