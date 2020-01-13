const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  contactperson: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  whatsapp: {
    type: String,
    required: false
  },
  billing_address: {
    type: String,
    required: false
  },
  shipping_address: {
    type: String,
    required: false
  },
  userid: {
    type: Schema.Types.ObjectId,
    required: true
  }
  
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
