// require necessary modules
const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  Models = require('./models.js');

// models
const Movies = Models.Movie,
  Genres = Models.Genre,
  Directors = Models.Director,
  Actors = Models.Actor,
  Users = Models.User;

// // Mongoose connection to localhost (for testing puproses during development)
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Now connected to MongoDB!'))
//   .catch((err) => console.error(err));

// Mongoose connection to online database for CRUD operations
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch((err) => console.error(err));

// Express function declared as variable app
const app = express();

// middleware
app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
// CORS that allows only specific domains
let allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:4200',
  'https://nightorbs-myflix.netlify.app',
  'https://nightorbs-myflix.herokuapp.com/',
  'https://nightorb.github.io'
];

// call CORS policy and check for allowed origins
app.use(cors({
  origin: (origin, callback) => {
    if (!origin)
    return callback(null, true);

    // if a specific origin isn't found in the list of allowed origins
    if (allowedOrigins.indexOf(origin) === -1) {
      let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// require passport
const passport = require('passport');
require('./passport');

app.use(passport.initialize());

// import auth endpoints
require('./auth')(app);

const { check, validationResult } = require('express-validator');

// GET requests
// get homepage
app.get('/', (req, res) => {
  res.send('Welcome to the movie API of myFlix!');
});

// get documentation page
app.get('/documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
});

/**
 * Endpoint to GET a list of all movies
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object with data from all movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .populate(['Genre','Director','Actors'])
      .then((movies) => {
        res.status(200).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Endpoint to GET a single movie object by title
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object with data of a single movie
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .populate(['Genre','Director','Actors'])
      .then((movie) => {
        if (movie === null) {
          return res.status(404).send('Movie not found');
        } else {
        res.status(200).json(movie);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Endpoint to GET a list of all genres
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of all genres
 */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Endpoint to GET a single genre object by name
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of a single genre
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      if (genre === null) {
        return res.status(404).send('Genre not found');
      } else {
        res.status(200).json(genre);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Endpoint to GET a list of all directors
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of all directors
 */
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.find()
    .populate('Movies')
      .then((directors) => {
        res.status(200).json(directors);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Endpoint to GET a single director object by name
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of a single director
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .populate('Movies')
      .then((director) => {
        if (director === null) {
          return res.status(404).send('Director not found')
        } else {
          res.status(200).json(director);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Endpoint to GET a list of all actors
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of all actors
 */
app.get('/actors', passport.authenticate('jwt', { session: false }), (req, res) => {
  Actors.find()
    .populate({
      path: 'Movies',
      populate: { path: 'Movie'}
    })
      .then((actors) => {
        res.status(200).json(actors);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Endpoint to GET a single actor object by name
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of a single actor
 */
app.get('/actors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Actors.findOne({ Name: req.params.Name })
    .populate({
      path: 'Movies',
      populate: { path: 'Movie'}
    })
      .then((actor) => {
        if (actor === null) {
          return res.status(404).send('Actor not found')
        } else {
          res.status(200).json(actor);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Endpoint to GET a list of all users
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object with details from all users
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find('Username Email Birthday FavoriteMovies')
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Endpoint to GET a single user object by username
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of a single user's details
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username }, 'Username Email Birthday FavoriteMovies') // add  to only return that
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Endpoint to POST (register) a new user
 * @method post
 * @param {req.body} - JSON object format required:
 * {
 * "Username": "username",
 * "Password": "password",
 * "Email": "username@email.com",
 * "Birthday": Date
 * }
 */
app.post('/users',
  [
    check('Username', 'Username must be at least 5 characters long.')
      .isLength({min: 5}),
    check('Username', 'Username can only contain alphanumeric characters.')
      .isAlphanumeric(),
    check('Password', 'Password must be a minimum of 8 characters long, contain at least one uppercase and one lowercase letter, one number and one symbol.')
      .notEmpty()
      .isStrongPassword(),
    check('Email', 'Email does not appear to be valid.')
      .isEmail()
      .normalizeEmail()
      .custom((value, {req}) => {
        return new Promise((resolve, reject) => {
          Users.findOne({ Email: req.body.Email }, function(err, user) {
            if (err) {
              console.error(err);
              reject(new Error('Server Error'));
            }
            if (user) {
              reject(new Error('Email is already in use'));
            }
            resolve(true);
          });
        });
      })
  ],
  (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);

    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          })
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

/**
 * Enpoint to PUT (update) a single user object by username
 * @method put
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of updated user details
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }),
  [
    check('Username', 'Username must be at least 5 characters long.')
      .isLength({min: 5})
      .optional(),
    check('Username', 'Username can only contain alphanumeric characters.')
      .isAlphanumeric()
      .optional(),
    check('Password', 'Password must be a minimum of 8 characters long, contain at least one uppercase and one lowercase letter, one number and one symbol.')
      .notEmpty()
      .isStrongPassword()
      .optional(),
    check('Email', 'Email does not appear to be valid.')
      .isEmail()
      .normalizeEmail()
      .optional()
  ],
 (req, res) => {
    // check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = req.body.Password ? Users.hashPassword(req.body.Password) : undefined;

    if (req.user.Username !== req.params.Username) {
      return res.status(401).send('This is not your account!');
    } else {
      Users.findOne({ Username: req.body.Username })
        .then((user) => {
          if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
          } else {
            Users.findOneAndUpdate(
              { Username: req.params.Username },
              { $set:
                {
                  Username: req.body.Username,
                  Password: hashedPassword,
                  Email: req.body.Email,
                  Birthday: req.body.Birthday
                }
              },
              { new: true }) // this line makes sure that the updated document is returned
                .then((updatedUser) => {
                  res.status(200).json(updatedUser);
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).send('Error: ' + err);
                });
            }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
  }
});

/**
 * Endpoint to DELETE a user
 * @method delete
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {string} - confirmation message
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(401).send('This is not your account!');
  } else {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
});

/**
 * Endpoint to GET a user's favorite movies
 * @method get
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object of a user's list of favorite movies
 */
app.get('/users/:Username/favorites', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .populate({
      path: 'FavoriteMovies',
      populate: [{ path: 'Genre'}, { path: 'Director'}]
    })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Endpoint to POST (add) a single movie by id to a user's list of favorite movies
 * @method post
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object with updated list of favorite movies
 */
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(401).send('This is not your account!');
  } else {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: //similar to $push operator
        { FavoriteMovies: req.params.MovieID }
      },
      { new: true })
        .then((updatedUser) => {
          res.status(201).json(updatedUser);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
  }
});

/**
 * Endpoint to DELETE a single movie by id from a user's list of favorite movies
 * @method delete
 * @param {req.headers} object - headers { "Authorization" : "Bearer <jwt>" }
 * @returns {object} - JSON object with updated list of favorite movies
 */
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(401).send('This is not your account!');
  } else {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull:
        { FavoriteMovies: req.params.MovieID }
      },
      { new: true })
        .then((updatedUser) => {
          res.status(200).json(updatedUser);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
  }
});

// error handler
// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port ' + port);
});