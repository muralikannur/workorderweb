const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

const logger = require('./logger')(module);

const app = express();
app.use(express.json());

const db = config.get('mongoURI');

mongoose
  .connect(db, { 
    useNewUrlParser: true,
    useCreateIndex: true
  }) 
  .then(() => logger.info('MongoDB Connected...'))
  .catch(err => logger.error(err));

// Use Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/wo', require('./routes/api/workorder'));
app.use('/api/material', require('./routes/api/material'));
app.use('/api/activate', require('./routes/api/activate'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/customer', require('./routes/api/customer'));


if (process.env.NODE_ENV != 'development') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Server started on port ${port}`));
