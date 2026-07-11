const express = require('express');
const Card = require('../models/Card');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Create a card in a list
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, listId, priority, dueDate } = req.body;
    const count = await Card.countDocuments({ list: listId });
    const card = await Card.create({
      title, description, list: listId, order: count, priority, dueDate,
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update card details (title/description/priority/dueDate)
router.put('/:id', protect, async (req, res) => {
  const card = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!card) return res.status(404).json({ message: 'Card not found' });
  res.json(card);
});

// Move a card to a new list/position (drag-and-drop endpoint)
// Re-normalizes order for both source and destination lists so
// positions stay a clean 0..n-1 sequence after every move.
router.patch('/:id/move', protect, async (req, res) => {
  try {
    const { toListId, newOrder } = req.body;
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const fromListId = card.list.toString();

    card.list = toListId;
    card.order = newOrder;
    await card.save();

    // Re-normalize destination list order
    const destCards = await Card.find({ list: toListId }).sort({ order: 1 });
    await Promise.all(
      destCards.map((c, idx) => Card.findByIdAndUpdate(c._id, { order: idx }))
    );

    // Re-normalize source list order if card moved across lists
    if (fromListId !== toListId) {
      const sourceCards = await Card.find({ list: fromListId }).sort({ order: 1 });
      await Promise.all(
        sourceCards.map((c, idx) => Card.findByIdAndUpdate(c._id, { order: idx }))
      );
    }

    res.json({ message: 'Card moved' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a card
router.delete('/:id', protect, async (req, res) => {
  const card = await Card.findByIdAndDelete(req.params.id);
  if (!card) return res.status(404).json({ message: 'Card not found' });
  res.json({ message: 'Card deleted' });
});

module.exports = router;
