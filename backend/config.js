const jwt=require('jsonwebtoken');

exports.getUserInfo =(req,res)=>{
    if(!req.headers.authorization){
        return null;
    }
  const data= jwt.decode(req.headers.authorization,process.env.JWT_SECRET);
  if(!data){
    res.status(401).send('user is not authorized..')

  }
   return data; 
}


