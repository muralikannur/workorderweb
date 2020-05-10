const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
  customercode: {
    type: String,
    required: false
  },
  companyname: {
    type: String,
    required: false
  },
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
  email: {
    type: String,
    required: false
  },  


  address1: {
    type: String,
    required: false
  },
  address2: {
    type: String,
    required: false
  },
  pin: {
    type: String,
    required: false
  },
  gst: {
    type: String,
    required: false
  },


  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
  
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);
