const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
   fullName: {
    type: String
  },

  dob: {
    type: Date
  },

  sex: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },

  qualification: {
    type: String
  },

  photo: {
    type: String   // Base64 string
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
