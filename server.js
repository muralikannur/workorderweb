const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

const logger = require('./logger')(module);

const app = express();
app.use(express.json());
app.set('trust proxy', true);

const db = config.get('mongoURI');
console.log(db)
mongoose
  .connect(db, { 
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true 
  }) 
  .then(() => logger.info('MongoDB Connected...'))
  .catch(err => logger.error(err));

// Use Routes
app.use('/api/users', require('./routes/api/auth/register'));
app.use('/api/auth', require('./routes/api/auth/login'));
app.use('/api/verify', require('./routes/api/auth/verify'));
app.use('/api/activate', require('./routes/api/auth/activate'));
app.use('/api/logout', require('./routes/api/auth/logout'));
app.use('/api/forgot', require('./routes/api/auth/forgot'));
app.use('/api/resetpassword', require('./routes/api/auth/reset'));

app.use('/api/wo', require('./routes/api/workorder'));
app.use('/api/material', require('./routes/api/material'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/customer', require('./routes/api/customer'));
app.use('/api/opt', require('./routes/api/optimization'));


if (process.env.NODE_ENV != 'development') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => logger.info(`Server started on port ${port}`));
