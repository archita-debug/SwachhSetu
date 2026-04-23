const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['citizen', 'authority'], default: 'citizen' },
  coins:     { type: Number, default: 0 },
  points:    { type: Number, default: 0 },
  badges:    [{ type: String }],
  wasteData: {
    today:     { type: Number, default: 0 },
    thisWeek:  { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
  },
  trainingProgress: { type: Number, default: 0 }, // percent 0–100
  isCompliant: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafe = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
