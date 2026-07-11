const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    list: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true, index: true },
    order: { type: Number, required: true, default: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
