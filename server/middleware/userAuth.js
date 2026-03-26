const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

      const decoded = jwt.verify(token, jwtSecret);

      if (decoded.type !== 'user') {
        return res.status(401).json({ message: 'Invalid token type' });
      }

      if (!decoded.name) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      req.user = {
        id: decoded.sub || decoded.name,
        name: decoded.name,
      };

      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      }

      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { userAuth };
