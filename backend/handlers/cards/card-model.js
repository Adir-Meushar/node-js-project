const mongoose=require('mongoose');
const moment = require('moment');

const addressSchema = new mongoose.Schema({
    state: String,
    country: { type: String, required: true },
    city: String,
    street: String,
    houseNumber: Number,
    zip:{type:Number,required:true},
  });
   
  const imgSchema = new mongoose.Schema({
    url: String,
    alt: String
  });  
  
const schema= new mongoose.Schema({
title:{type:String,required:true},
subtitle:{type:String,required:true},
description:{type:String,required:true},
phone:{type:String,required:true},
email:{type:String,required:true},
web:{type:String,required:true},
img:imgSchema,
address:addressSchema,
bizNumber: {type:Number,default: () => Math.floor(Math.random() * 9000000) + 1000000},
likes:{type:Array},
user_id: {
  type: mongoose.Schema.Types.ObjectId,
  required: true, 
},
createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
});

exports.Card=mongoose.model('cards',schema);