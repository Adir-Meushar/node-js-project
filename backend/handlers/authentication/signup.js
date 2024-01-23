const { User } = require('../user/user-model');
const userValidationSchema = require('../user/user-joiValid');

module.exports = app => {
  app.post('/users', async (req, res) => {
    const { fullName, phone, email, password, address, img,isBusiness } = req.body;

    const { error, value } = userValidationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = new User({
      fullName,
      phone,
      email,
      password,
      address,
      img,
      isBusiness
    });

    try {
      const newUser = await user.save();
      res.send(newUser);
    } catch (error) {
      res.status(500).send({ error: 'Error creating user' });
    }
  });
};
