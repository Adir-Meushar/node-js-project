const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {User}=require('../user/user-model');
const { JWT_SECRET } = require('../../config');
 
 module.exports=app=>{
    app.post('/users/login',async (req,res)=>{
        const {email,password}=req.body;
        const user= await User.findOne({email});
        if (!email || !password) {
            return res.status(400).send('email and password are required.');
          }
        if(!user){
           return res.status(401).send('email or password is incorrect..');
        }
        const passwordMatch=await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(401).send('email or password is incorrect..');
        }
        const token=jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:'1h'});//creating token only with the userID;
        res.send(token); 
    })
 }