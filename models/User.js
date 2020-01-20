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
  account_activated: {
    type: Boolean,
    default: false
  },
  activation_code: {
    type: Schema.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId()
  },
  verification_code: {
    type: Schema.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId()
  },
  last_timestamp: {
    type: Date,
    default: Date.now
  },
  ip_address: {
    type: String,
    default:''
  }
});

module.exports = User = mongoose.model('user', UserSchema);
