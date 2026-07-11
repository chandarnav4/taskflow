const express = require('express');
const Board = require('../models/Board');
const List = require('../models/List');
const Card = require('../models/Card');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all boards for logged-in user
router.get('/', protect, async (req, res) => {
  const boards = await Board.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(boards);
});

// Create a board
router.post('/', protect, async (req, res) => {
  try {
    const board = await Board.create({ title: req.body.title, owner: req.user._id });
    res.status(201).json(board);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a board with its lists and cards (full board view)
router.get('/:id', protect, async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const lists = await List.find({ board: board._id }).sort({ order: 1 });
  const listIds = lists.map((l) => l._id);
  const cards = await Card.find({ list: { $in: listIds } }).sort({ order: 1 });

  const listsWithCards = lists.map((list) => ({
    ...list.toObject(),
    cards: cards.filter((c) => c.list.toString() === list._id.toString()),
  }));

  res.json({ ...board.toObject(), lists: listsWithCards });
});

// Delete a board (and its lists/cards)
router.delete('/:id', protect, async (req, res) => {
  const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
  if (!board) return res.status(404).json({ message: 'Board not found' });

  const lists = await List.find({ board: board._id });
  const listIds = lists.map((l) => l._id);
  await Card.deleteMany({ list: { $in: listIds } });
  await List.deleteMany({ board: board._id });
  await board.deleteOne();

  res.json({ message: 'Board deleted' });
});

module.exports = router;
