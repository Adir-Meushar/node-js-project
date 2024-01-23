require('dotenv').config();
const express=require('express');
const cors =require('cors');
const mongoose=require('mongoose');
const chalk=require('chalk'); 
const loggerMiddleware=require('./logger');
const port=process.env.PORT;
async function main(){
    await mongoose.connect(process.env.REMOTE_URL)
    console.log(chalk.blue('Connection Established'));
}
main().catch(err=>console.log(chalk.red(err))); 

const app=express(); 
 
app.use(express.json());


app.use(cors({ 
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use(loggerMiddleware);


app.listen(port,()=>{
    console.log(chalk.blue(`Listening to port ${port}`));
}) 

app.use(express.static("public"));

require('./handlers/authentication/signup')(app);
require('./handlers/authentication/login')(app);
require('./handlers/user/users')(app);
require('./handlers/cards/card')(app);
require('./initial-data/initialDataService');

app.get("*", (req, res) => {
   res.sendFile(`${__dirname}/public/index.html`);
});