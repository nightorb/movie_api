const jwtSecret = 'your_jwt_secret'; // has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport.js');

/**
 * Generates JWT web token
 * @function generateJWTToken
 * @param {object} user - Object containing the user data
 * @returns {string} - JWT web token
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, // the username to incode in the JWT
    expiresIn: '7d', // specifies when token expires (7 days)
    algorithm: 'HS256' // algorithm used to "sign" or encode values of JWT
  });
}

/**
 * POST login credentials and create JWT token
 * @param {*} router 
 */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}