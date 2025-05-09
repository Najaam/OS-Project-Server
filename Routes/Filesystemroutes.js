const express = require('express');
const router = express.Router();
const FileSystemEntry = require('../Models/FileSchema');

// Create File or Directory

router.get('/',(req, res)=>{
    res.status(200).json("This is file route")
  })
router.post('/', async (req, res) => {
    try {
      const { name, type, path, extension, content } = req.body;
  
      const entry = await FileSystemEntry.create({
        email: req.user.email,
        name,
        type,
        path,
        extension: type === 'file' ? extension : undefined,
        content: type === 'file' ? content : undefined
      });
  
      res.status(201).json(entry);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Get all entries for a user
  router.get('/', async (req, res) => {
    try {
      const entries = await FileSystemEntry.find({ email: req.user.email });
      res.json(entries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Update an entry by ID
  router.put('/:id', async (req, res) => {
    try {
      const entry = await FileSystemEntry.findOneAndUpdate(
        { _id: req.params.id, email: req.user.email },
        req.body,
        { new: true }
      );
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
  
      res.json(entry);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // Delete an entry by ID
  router.delete('/:id', async (req, res) => {
    try {
      const deleted = await FileSystemEntry.findOneAndDelete({
        _id: req.params.id,
        email: req.user.email
      });
  
      if (!deleted) return res.status(404).json({ error: 'Entry not found' });
  
      res.json({ message: 'Entry deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  module.exports = router;