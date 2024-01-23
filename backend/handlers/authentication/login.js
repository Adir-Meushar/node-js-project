const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../user/user-model');
const loginSchema = require('../user/user-joiValid');

module.exports = app => {
  app.post('/users/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { email, password } = value;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send('Email or password is incorrect.');
    }
    // Check if the user is currently blocked
    const blockedUsers = app.get('blockedUsers') || {};
    if (blockedUsers[user.email] && blockedUsers[user.email].blockExpires > Date.now()) {
      const remainingTime = Math.ceil((blockedUsers[user.email].blockExpires - Date.now()) / 1000);
      return res.status(401).send(`Account is blocked. Try again in ${remainingTime} seconds.`);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      blockedUsers[user.email] = blockedUsers[user.email] || { loginAttempts: 0 };
      blockedUsers[user.email].loginAttempts += 1;

      if (blockedUsers[user.email].loginAttempts >= 3) {
        blockedUsers[user.email].blockExpires = Date.now() + 3600000; // Block for 1 hour
        return res.status(401).send('Account is blocked. Try again later.');
      }

      app.set('blockedUsers', blockedUsers);
      return res.status(401).send('Email or password is incorrect.');
    }

    // If the password is correct, reset the loginAttempts counter
    blockedUsers[user.email] = blockedUsers[user.email] || { loginAttempts: 0 };
    blockedUsers[user.email].loginAttempts = 0;
    app.set('blockedUsers', blockedUsers);
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, isBusiness: user.isBusiness }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send(token);
  });
};
