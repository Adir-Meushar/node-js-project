const bcrypt = require('bcrypt');
const { User } = require('../user/user-model');
const userValidationSchema = require('../user/user-joiValid');

module.exports = app => {
  app.post('/users', async (req, res) => {
    const { fullName, phone, email, password, address, img } = req.body;

    const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
      address,
      img,
    });

    try {
      const newUser = await user.save();
      res.send(newUser);
    } catch (error) {
      res.status(500).send({ error: 'Error creating user' });
    }
  });
};




// const bcrypt = require('bcrypt');
// const{User}=require('../user/user-model')
// module.exports = (app) => {
//     app.post('/users', async (req, res) => {
//         try {
//             const { fullName, phone, email, password, address, img } = req.body;

//             // Validation or other checks can be added here

//             const hashedPassword = await bcrypt.hash(password, 10);

//             const user = new User({
//                 fullName,
//                 phone,
//                 email,
//                 password: hashedPassword,
//                 address,
//                 img,
//             });

//             const newUser = await user.save();
//             res.status(201).send(newUser); // HTTP status 201 indicates successful creation
//         } catch (error) {
//             console.error(error);
//             res.status(500).send('Internal Server Error');
//         }
//     });
// };