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
  woitems:{
    type: Array,
    default:[]
  },
  status: {
    type:String,
    default:'New'
  }
});

module.exports = Item = mongoose.model('workorder', WorkOrderSchema);
