const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['file', 'directory'], required: true },
  content: { type: String, default: '' }, // only for files
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'File', default: null }, // null means root
  ownerEmail: { type: String, required: true, ref: 'User' }, // referencing by email
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);
