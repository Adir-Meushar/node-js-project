const jwt=require('jsonwebtoken');
const JWT_SECRET='FullStack@#W131122nodeJS!!!AM26IHC63';


exports.getLoggedUserId=(req,res)=>{
    if(!req.headers.authorization){
        return null;
    }
  const data= jwt.decode(req.headers.authorization,JWT_SECRET);
  if(!data){
    res.status(401).send('user is not authorized..')

  }

  return data.userId;
}


exports.JWT_SECRET=JWT_SECRET;