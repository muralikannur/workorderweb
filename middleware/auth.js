const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger')(module);

function auth(req, res, next) {
  const token = req.header('x-auth-token');

  // Check for token
  if (!token)
    return res.status(401).json({ msg: '' });

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Add user from payload
      req.user = decoded;
      User.findById(req.user.id).then(u => {
          req.user.name = u.name;
          next();
      }).catch(err => { logger.error(err); next(); })
    
  } catch (e) {
    res.status(400).json({ msg: '' });
  }
}

module.exports = auth;
