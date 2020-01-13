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
  billing_address: {
    type: String,
    required: false
  },
  shipping_address: {
    type: String,
    required: false
  }
  
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);
