const { getUserInfo } = require("../../config");
const guard = require("../../guard");
const { User } = require("../user/user-model");
const cardValidationSchema = require("./card-joyValid");
const { Card } = require("./card-model");

module.exports=app=>{

    //get all cards-Everyone//
    app.get('/cards',async(req,res)=>{
        const cards=await Card.find();
        res.send(cards);
    });

    //get my cards-cardOwner//
    app.get('/cards/my-cards', guard, async (req, res) => {
        try {
            const userToken = getUserInfo(req, res);
            const currentUser = await User.findById(userToken.userId);
            if(!currentUser.isBusiness){
                return res.status(401).send('User not authorized only business users can have cards,you can change your status whenever you want.');

            }
        
            const myCards = await Card.find({ userId: userToken.userId});

            if (!myCards || myCards.length === 0) {
                return res.status(404).send('You dont seem to have any cards at the moment..');
            }
    
            res.send({
                message: `Here are your cards, ${currentUser.fullName.first}:`,
                user: userToken.userId,
                myCards: myCards
            });
        } catch (error) {
             
            res.status(500).send(error.message);
        }
    
});
    //get one card-Everyone//
    app.get('/cards/:id',async(req,res)=>{
        const card=await Card.findById(req.params.id);
        if(!card){
            return res.status(404).send('card was not found..')
        }
        res.send(card);
    });

    
    //create card-Business user//
    app.post('/cards',guard,async (req,res)=>{
        const userToken=getUserInfo(req,res);
        const user= await User.findById(userToken.userId); 
        if(!user.isBusiness){
            return res.status(401).send('User not authorized')
        }
        const{title,subtitle,description,phone,email,web,img,address}=req.body;
        
        const {error,value}=cardValidationSchema.validate(req.body,{abortEarly:false});
        if(error){
            return res.status(400).json({error:error.details.map(detail=>detail.message)});
        }
      
        const card=new Card({
            title,
            subtitle,
            description,
            phone,
            email,
            web,
            img,
            address,
            user_id:userToken.userId
        });
        try{
            const newCard=await card.save();
            res.send(newCard); 
        }catch(err){
            console.error('Error creating card:', err);
            res.status(500).send({ err: 'Error creating card' });
        }
       
    });

    //delete card-cardOwner&Admin
    app.delete('/cards/:id', guard, async (req, res) => {
        const userToken = getUserInfo(req, res);
        const card = await Card.findById(req.params.id);

        if (!card) {
            return res.status(404).send('Card not found.');
        }

        if (userToken.userId !== card.user_id && !userToken.isAdmin) {
            return res.status(401).send('User not authorized.');
        }
    
        try {
            const cardToDelete = await Card.findByIdAndDelete(req.params.id);
            return res.status(200).send('Card was deleted successfully!');
        } catch (err) {
            return res.status(500).send('Something went wrong. Please reload the page.');
        }
    });

    //edit card-cardOwner//
    app.put('/cards/:id',guard,async (req,res)=>{
     const userToken=getUserInfo(req,res);
     const card =await Card.findById(req.params.id);

     if (userToken.userId != card.user_id) {
        return res.status(401).send('User not authorized.');
    }

     try{ 
        const {error,value}= cardValidationSchema.validate(req.body,{abortEarly:false});
        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
          }
          card.set(value); 
          const newCard=await card.save();
          res.send(newCard);
     }catch(err){
        return res.status(500).send('Something went wrong. Please reload the page.');
      }
    });

    //card likes-Registerd User//
    app.patch('/cards/:id', guard, async (req, res) => {
        try {
            const userToken = getUserInfo(req, res);
            const user = await User.findById(userToken.userId);
            const card = await Card.findById(req.params.id);
    
            if (!user) {
                return res.status(401).send('Only registered users can like cards.');
            }
            const likedIndex = card.likes.indexOf(userToken.userId);
            if (likedIndex !== -1) { 
                // User already liked the card, so remove the like
                card.likes.splice(likedIndex, 1);
            } else {
                // User didn't like the card, add the like
                card.likes.push(userToken.userId);
            }

            const newCard = await card.save();
            res.send(newCard);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });


}   