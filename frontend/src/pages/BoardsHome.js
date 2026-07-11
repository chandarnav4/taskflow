import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const BoardsHome = () => {
  const [boards, setBoards] = useState([]);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const fetchBoards = async () => {
    const { data } = await api.get('/boards');
    setBoards(data);
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post('/boards', { title: title.trim() });
    setTitle('');
    fetchBoards();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this board?')) return;
    await api.delete(`/boards/${id}`);
    fetchBoards();
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h2>My Boards</h2>
        <div>
          <span className="nav-user">Hi, {user?.name}</span>
          <button className="link-btn" onClick={logout}>Logout</button>
        </div>
      </div>
      <form onSubmit={handleCreate} className="search-bar">
        <input placeholder="New board title..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Create Board</button>
      </form>
      <div className="board-grid">
        {boards.map((board) => (
          <div key={board._id} className="board-card">
            <div onClick={() => navigate(`/boards/${board._id}`)}>{board.title}</div>
            <button className="link-btn" onClick={() => handleDelete(board._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardsHome;
