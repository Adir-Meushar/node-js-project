const mongoose=require('mongoose');
const moment = require('moment');
const { Types } = require("mongoose");
const addressSchema = new mongoose.Schema({
    state: String,
    country: { type: String, required: true },
    city: String,
    street: String,
    houseNumber: String,
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
email:{type:String,required:true,unique:true},
web:{type:String,required:true},
img:imgSchema,
address:addressSchema,
bizNumber:{type:Number,default:()=>Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000}, 
likes:{type:Array},
userId: {
  type: Types.ObjectId,
  required: true
},
createdTime: { type: String, default: () => moment().format('D-M-Y HH:mm:ss') }
});

exports.Card=mongoose.model('cards',schema);