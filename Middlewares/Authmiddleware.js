const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

function verifyToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Support 'Bearer <token>' format

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use secret from .env
    req.user = decoded; // Attach full payload (userId, email, etc.) to req.user
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
