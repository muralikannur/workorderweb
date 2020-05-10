const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WorkOrderSchema = new Schema({
  wonumber: {
    type: String,
    required: true,
    unique:true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  customer_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  woitems:{
    type: Array,
    default:[]
  },
  status: {
    type:String,
    default:'New'
  },  

  client:{ type: String,  required: false  },
  billing_address1:{ type: String,  required: false  },
  billing_address2:{ type: String,  required: false  },
  billing_pin:{ type: String,  required: false  },
  billing_phone:{ type: String,  required: false  },
  billing_gst:{ type: String,  required: false  },
  shipping_address1:{ type: String,  required: false  },
  shipping_address2:{ type: String,  required: false  },
  shipping_pin:{ type: String,  required: false  },
  shipping_phone:{ type: String,  required: false  },
  shipping_gst:{ type: String,  required: false  },




});

module.exports = Item = mongoose.model('workorder', WorkOrderSchema);
