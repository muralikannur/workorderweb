const config = require('config');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger')(module);

function auth(req, res, next) {

  // req.user = {id:'62fa72d4a21d5e6dbc45b419',name:'murali'};
  // next();


  const token = req.header('x-auth-token');

  // Check for token
  if (!token){
    console.log('No token present.');
    return res.status(401).json({ msg: 'No token present.' });
  }
  try {
    // Verify token
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    // Add user from payload
      req.user = decoded;
      User.findById(req.user.id).then(u => {
          req.user.name = u.name;
          User.updateOne({_id:req.user.id},{last_timestamp:Date.now()},(err,raw) => {})
          next();
      }).catch(err => { logger.error(err); next(); })
    
  } catch (e) {
    console.log('Invalid Token');
    res.status(400).json({ msg: 'Invalid Token' });
  }
}

module.exports = auth;
