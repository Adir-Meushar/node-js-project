const bcrypt = require('bcrypt');
const { getLoggedUserId } = require("../../config");
const guard = require("../../guard");
const userValidationSchema = require("./user-joiValid");
const { User } = require("./user-model");

module.exports = (app) => {
    //Get all users-Admin//
    app.get('/users', guard, async (req, res) => {
      const userId = getLoggedUserId(req, res); //get userId from jwt
      const currentUser = await User.findById(userId);
   
      
      if (!currentUser.isAdmin) {
          return res.status(401).send('User is not authorized');
      }

      const users = await User.find();
      res.send(users);
  });

    //Get current user-Admin&current user//
      app.get('/users/:id',guard,async(req,res)=>{
        const userId=getLoggedUserId(req,res);
        const currentUser=await User.findById(userId);

        if(userId!==req.params.id&&!currentUser.isAdmin){
            return res.status(401).send('User not authorized');
        }
        try{
            const user=await User.findById(req.params.id).select('-password');
            if(!user){
                return res.status(403).send('User not found');
            }
            res.send(user);
        }
        catch(err){
            return res.status(403).send('User not found');
        }
      })

      //User-Patch-current user// 
      app.patch('/users/:id',guard,async(req,res)=>{
        const userId=getLoggedUserId(req,res);
        if(userId!==req.params.id){
            return res.status(401).send('User is not authorized');
        }
        try{
            const user=await User.findById(req.params.id);
            user.isBusiness=!user.isBusiness;
           await user.save();
           res.send(user);
        }
        catch(err){
            return res.status(500).send('Somthing went wrong please reload the page');
        }
      })

     //User-Delete-Admin&current user// 
      app.delete('/users/:id',guard,async(req,res)=>{
        const userId=getLoggedUserId(req,res);
        const currentUser=await User.findById(userId);
        if(userId!==req.params.id&&!currentUser.isAdmin){
            return res.status(401).send('User is not authorized');
        }
        try{ 
            const user=await User.findByIdAndDelete(req.params.id);
            res.status(200).send('User deleted sucssesfully!');
        }catch(err){
            return res.status(500).send('Somthing went wrong please reload the page');
        }
      })

     //User-Edit-current user//
     app.put('/users/:id', guard, async (req, res) => {
    const userId = getLoggedUserId(req, res);
    if (userId !== req.params.id) {
      return res.status(401).send('User is not authorized');
    }
    try {
      const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
      if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(401).send('User not found..');
      }
      if (value.password) {
        const hashedPassword = await bcrypt.hash(value.password, 10);
        value.password = hashedPassword;
      }

      //overriding the default usermodel;
      value.isAdmin=user.isAdmin;
      value.isBusiness=user.isBusiness;
      user.set(value);
  
      const newUser = await user.save();

      res.status(200).send(newUser);

    } catch(err){
      return res.status(500).send('Something went wrong. Please reload the page.');
    }
  });
}
