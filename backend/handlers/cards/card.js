const { getLoggedUserId } = require("../../config");
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

    //get one card-Everyone//
    // app.get('/cards/:id',async(req,res)=>{
    //     const card=await Card.findById(req.params.id);
    //     if(!card){
    //         return res.status(404).send('card was not found..')
    //     }
    //     res.send(card);
    // });

    //create card-Business user//
    app.post('/cards',guard,async (req,res)=>{
        const userId=getLoggedUserId(req,res);
        const user= await User.findById(userId); 
        if(!user.isBusiness){
            return res.status(401).send('User not authorized')
        }
        const{title,subtitle,description,phone,email,web,img,address}=req.body;
        const {error,value}=cardValidationSchema.validate(req.body,{abortEarly:false});
        if(error){
            return res.status(400).json({error:error.details.map(detail=>detail.message)});
        }
        const existingCard=await Card.findOne({email});
        if(existingCard){
            return res.status(400).send('Card with this email is alredy exists')
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
            userId:userId
        });
        try{
            const newCard=await card.save();
            res.send(newCard);
        }catch(err){
            res.status(500).send({ err: 'Error creating user' });
        }
       
    });

    //delete card-Owner&Admin
    app.delete('/cards/:id', guard, async (req, res) => {
        const userId = getLoggedUserId(req, res);
        const card = await Card.findById(req.params.id);
        const currentUser = await User.findById(userId);
    
        if (!card) {
            return res.status(404).send('Card not found.');
        }
    
        if (userId !== card.userId && !currentUser.isAdmin) {
            return res.status(401).send('User not authorized.');
        }
    
        try {
            const cardToDelete = await Card.findByIdAndDelete(req.params.id);
            return res.status(200).send('Card was deleted successfully!');
        } catch (err) {
            return res.status(500).send('Something went wrong. Please reload the page.');
        }
    });

    //edit card-Owner//
    app.put('/cards/:id',guard,async (req,res)=>{
     const userId=getLoggedUserId(req,res);
     const card =await Card.findById(req.params.id);
     if(userId!==card.userId){
        return res.status(401).send('User not authorized.');
     }
     try{ 
        const {error,value}= cardValidationSchema.validate(req.body,{abortEarly:false});
        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
          }

        //fix biznumber change
          card.set(value); 
          const newCard=await card.save();
          res.send(newCard);
     }catch(err){
        return res.status(500).send('Something went wrong. Please reload the page.');
      }
    });

    //like card-Registerd User//
    app.patch('/cards/:id', guard, async (req, res) => {
        try {
            const userId = getLoggedUserId(req, res);
            const user = await User.findById(userId);
            const card = await Card.findById(req.params.id);
    
            if (!user) {
                return res.status(401).send('Only registered users can like cards.');
            }
            const likedIndex = card.likes.indexOf(userId);
            if (likedIndex !== -1) {
                // User already liked the card, so remove the like
                card.likes.splice(likedIndex, 1);
            } else {
                // User didn't like the card, add the like
                card.likes.push(userId);
            }

            const newCard = await card.save();
            res.send(newCard);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/cards/my-cards', guard, async (req, res) => {
            try {
                const userId = getLoggedUserId(req, res);
                const currentUser = await User.findById(userId);
            
                const myCards = await Card.find({ userId: userId });

                if (!myCards || myCards.length === 0) {
                    return res.status(404).send('Your cards not found');
                }
        
                res.send({
                    message: `Here are your cards, ${currentUser.fullName.first}:`,
                    user: userId,
                    myCards: myCards
                });
            } catch (error) {
                
                res.status(500).send(error.message);
            }
        
    });
}   