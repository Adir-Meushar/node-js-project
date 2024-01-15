const mongoose = require('mongoose');
const moment = require('moment');

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
  houseNumber: String
  //Zip???!?!??!!?
});

const imgSchema = new mongoose.Schema({
  url: String,
  alt: String
});

const userSchema = new mongoose.Schema({
  fullName: nameSchema,
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: addressSchema,
  img: imgSchema,
  isBusiness: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
});

exports.User = mongoose.model("users", userSchema);



//Original User Schema//

// const mongoose=require('mongoose');
// const moment = require('moment');

// const schema = new mongoose.Schema({
//     fullName: {
//       first: { type: String, required: true },
//       middle: String,
//       last: { type: String, required: true }
//     },
//     phone: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password:{type:String,required:true},
//     address: {
//       state:String,
//       country: { type: String, required: true },
//       city: String,
//       street: String,
//       houseNumber: String
//     },
//     img: {
//       url: String,
//       alt: String
//     },
//     isBusiness:{type:Boolean,default:false},
//     isAdmin:{type:Boolean,default:false},
//     createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
//   });
  

// exports.User = mongoose.model("users", schema);    