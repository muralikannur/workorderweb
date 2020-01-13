const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const MaterialSchema = new Schema({
  wo_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  boards:{
    type: Array,
    default:[]
  },
  laminates:{
    type: Array,
    default:[]
  },
  materialCodes:{
    type: Array,
    default:[]
  },
  profiles:{
    type: Array,
    default:[]
  },
  edgebands:{
    type: Array,
    default:[]
  }

});

module.exports = Item = mongoose.model('material', MaterialSchema);
