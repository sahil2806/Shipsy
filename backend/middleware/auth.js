const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add some debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Decoded token:', decoded);
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('🔒 Auth middleware error:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = auth; 