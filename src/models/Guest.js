const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
 },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  attendanceStatus: {
    type: String,
    enum: ["ALONE", "WITH_PARTNER", "ABSENT"],
    required: true,
  },
}, { 
    timestamps: true 
   });

module.exports = mongoose.model("Guest", GuestSchema);
