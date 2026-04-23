const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:    { type: String, required: true, enum: ['Illegal Dumping','Overflowing Bin','Construction Debris','Hazardous Waste','Other'] },
  description: { type: String, required: true },
  photo:       { type: String },          // filename in /uploads
  location: {
    lat:     { type: Number },
    lng:     { type: Number },
    address: { type: String },
  },
  status: { type: String, enum: ['Submitted','Under Review','Action Taken','Resolved'], default: 'Submitted' },
  coinsAwarded: { type: Number, default: 20 },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
