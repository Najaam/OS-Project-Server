const express = require('express');
const router = express.Router();
const File = require('../Models/FileSchema');

router.get('/',(req, res)=>{
    res.status(200).json("This is File system routes route")
  })
router.post('/create', async (req, res) => {
  try {
    const { name, type, content, parent, ownerEmail } = req.body;

    const userExists = await User.findOne({ email: ownerEmail });
    if (!userExists) return res.status(404).json({ error: 'User not found' });

    const newFile = new File({ name, type, content, parent, ownerEmail });
    await newFile.save();

    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// READ files/directories by user
router.get('/list', async (req, res) => {
  try {
    const { ownerEmail, parent } = req.query;
    const filter = { ownerEmail };
    if (parent) filter.parent = parent;
    else filter.parent = null;

    const files = await File.find(filter);
    res.json(files);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// UPDATE file (name or content) — only files can have content
router.put('/update/:id', async (req, res) => {
  try {
    const { name, content } = req.body;

    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    if (name) file.name = name;
    if (content !== undefined && file.type === 'file') file.content = content;

    await file.save();
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// DELETE file or directory
router.delete('/delete/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });

    // Optionally, delete children if it's a directory
    if (file.type === 'directory') {
      await File.deleteMany({ parent: file._id });
    }

    await file.deleteOne();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;