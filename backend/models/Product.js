const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },

  description: { 
    type: String, 
    required: true,
    trim: true
  },

  price: { 
    type: Number, 
    required: true,
    min: 0
  },

  category: { 
    type: String, 
    required: true,
    trim: true
  },

  status: { 
    type: String, 
    required: true,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },

  tags: { 
    type: [String],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: 'At least one tag is required'
    }
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
