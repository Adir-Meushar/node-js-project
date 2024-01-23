const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcrypt');

const nameSchema = new mongoose.Schema({
  first: { type: String, required: true },
  middle: String,
  last: { type: String, required: true },
});

const addressSchema = new mongoose.Schema({
  state: String,
  country: { type: String, required: true },
  city: String, 
  street: String,
  houseNumber: String,
  zip: { type: Number, default: 0 },
});

const imgSchema = new mongoose.Schema({
  url: String,
  alt: String
}); 

const userSchema = new mongoose.Schema({
  fullName: nameSchema,
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: addressSchema,
  img: imgSchema,
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
});

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
      return next();
  }

  try {
      user.password = await bcrypt.hash(this.password, 10);
      next();
  } catch (err) {
      return next(err);
  }
});

exports.User = mongoose.model('users', userSchema);
