const mongoose = require('mongoose');
const fileSystemSchema = new mongoose.Schema({
    email: { type: String, required: true }, 
  
    name: { type: String, required: true },
    type: { type: String, enum: ['file', 'directory'], required: true },
    path: { type: String, required: true },
  
    extension: { type: String },
    content: { type: String },
  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('FileSystemEntry', fileSystemSchema);
