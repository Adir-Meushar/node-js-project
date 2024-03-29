const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    jwt.verify(req.headers.authorization,process.env.JWT_SECRET,(err,data)=>{
        if(err){
            return res.status(401).send({
                error: {
                  code: 401,
                  message: 'Unauthorized',
                  details: 'User authentication failed. Please check your email and password and try again.',
                },
              });
         }else{
            next();
         }
    })
}