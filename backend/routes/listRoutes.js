const express = require('express');
const List = require('../models/List');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create a list on a board
router.post('/', protect, async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const count = await List.countDocuments({ board: boardId });
    const list = await List.create({ title, board: boardId, order: count });
    res.status(201).json(list);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rename a list
router.put('/:id', protect, async (req, res) => {
  const list = await List.findByIdAndUpdate(req.params.id, { title: req.body.title }, { new: true });
  if (!list) return res.status(404).json({ message: 'List not found' });
  res.json(list);
});

// Delete a list
router.delete('/:id', protect, async (req, res) => {
  const list = await List.findByIdAndDelete(req.params.id);
  if (!list) return res.status(404).json({ message: 'List not found' });
  res.json({ message: 'List deleted' });
});

module.exports = router;
