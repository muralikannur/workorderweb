const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  code: {
    type: Schema.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId()
  }
  
});

module.exports = User = mongoose.model('user', UserSchema);
