import { useState } from 'react';

const CardModal = ({ card, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority || 'medium');
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.slice(0, 10) : '');

  const handleSave = () => {
    onSave(card._id, { title, description, priority, dueDate: dueDate || null });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <input className="modal-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label>Due date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

        <div className="modal-actions">
          <button onClick={handleSave}>Save</button>
          <button className="danger" onClick={() => { onDelete(card._id); onClose(); }}>Delete</button>
          <button className="secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
