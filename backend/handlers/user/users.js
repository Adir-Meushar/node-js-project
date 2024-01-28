const { getUserInfo } = require("../../config");
const guard = require("../../guard");
const {userValidationSchema} = require("./user-joiValid");
const { User } = require("./user-model");
const jwt=require('jsonwebtoken');

module.exports = (app) => {
    //Get all users-Admin//
    app.get('/users', guard, async (req, res) => {
      const userToken = getUserInfo(req, res); 
      if (!userToken.isAdmin) {
        return res.status(401).send({
          error: {
            code: 401,
            message: 'Unauthorized',
            details: 'User authentication failed.',
          },
        });
      }
      const users = await User.find();
      res.send(users);
  });

    //Get current user-Admin&current user//
      app.get('/users/:id',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);
      
        if(userToken.userId!==req.params.id&&!userToken.isAdmin){
          return res.status(401).send({
            error: {
              code: 401,
              message: 'Unauthorized',
              details: 'User authentication failed.',
            },
          });
        }
        try{
            const currentUser=await User.findById(req.params.id).select('-password');
            if(!currentUser){
                return res.status(403).send('User not found');
            } 
            res.send(currentUser);
        }
        catch(err){
            return res.status(403).send('User not found');
        }
      })

      //User-Patch-current user// 
      app.patch('/users/:id',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);
        if(userToken.userId!==req.params.id){
            return res.status(401).send('User is not authorized');
        }
        try{
            const user=await User.findById(req.params.id);
            user.isBusiness=!user.isBusiness;
           await user.save();
           const updatedUser = await User.findById(req.params.id);
           const newToken = jwt.sign({ userId: updatedUser._id, isBusiness: updatedUser.isBusiness,isAdmin:updatedUser.isAdmin}, process.env.JWT_SECRET, { expiresIn: '1h' });
           res.send(user);
        }
        catch(err){
            return res.status(500).send('Somthing went wrong please reload the page');
        }
      })

     //User-Delete-Admin&current user// 
      app.delete('/users/:id',guard,async(req,res)=>{
        const userToken=getUserInfo(req,res);
        if(userToken.userId!==req.params.id&&!userToken.isAdmin){
          return res.status(401).send({
            error: {
              code: 401,
              message: 'Unauthorized',
              details: 'User authentication failed.',
            },
          });
        } 
        try{ 
            const currentUser=await User.findByIdAndDelete(req.params.id);
            if(!currentUser){
              return res.status(403).send('User not found');
            }
            res.status(200).send({
              message:`User was deleted sucssesfully!`,
              deletedUser:currentUser,
            });
        }catch(err){
            return res.status(404).send('User not found');
        }
      })

     //User-Edit-current user//
     app.put('/users/:id', guard, async (req, res) => { 
      const userToken = getUserInfo(req, res);
      if (userToken.userId !== req.params.id) {
        return res.status(401).send({
          error: {
            code: 401,
            message: 'Unauthorized',
            details: 'User authentication failed.',
          },
        });
      }
      
      try {
        const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
        if (error) {
          return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }
    
        // Check if the email already exists for a different user
        const existingUser = await User.findOne({ email: value.email, _id: { $ne: req.params.id } });
        if (existingUser) {
          return res.status(400).send('Email is already in use by another user.');
        }
    
        const user = await User.findById(req.params.id);
    
        if (!user) {
          return res.status(401).send('User not found.');
        }
    
        // Update user properties 
        value.isAdmin = user.isAdmin;
        value.isBusiness = user.isBusiness;
        user.set(value);
    
        const newUser = await user.save();
    
        res.status(200).send(newUser);
    
      } catch (err) {
        return res.status(500).send('Something went wrong. Please reload the page.');
      }
    });
    
}
