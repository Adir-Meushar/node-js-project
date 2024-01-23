const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    jwt.verify(req.headers.authorization,process.env.JWT_SECRET,(err,data)=>{
        if(err){
            return res.status(401).send('User not autho..')
         }else{
            next();
         }
    })
}