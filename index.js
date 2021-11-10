const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

const Models = require('./models.js');

const Movies = Models.Movie;
const Genres = Models.Genre;
const Directors = Models.Director;
const Actors = Models.Actor;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch((err) => console.error(err));

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
});

// get a list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get a movie by its title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    res.status(201).json(movie);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get a list of all genres
app.get('/genres', (req, res) => {
  Genres.find()
  .then((genres) => {
    res.status(201).json(genres);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get a genre by its name
app.get('/genres/:name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
  .then((genre) => {
    res.status(201).json(genre);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get a list of all directors
app.get('/directors', (req, res) => {
  Directors.find()
  .then((directors) => {
    res.status(201).json(directors);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get a director by their name
app.get('/directors/:name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
  .then((director) => {
    res.status(201).json(director);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get a list of all actors
app.get('/actors', (req, res) => {
  Actors.find()
  .then((actors) => {
    res.status(201).json(actors);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get an actor by their name
app.get('/actors/:name', (req, res) => {
  Actors.findOne({ Name: req.params.Name })
  .then((actor) => {
    res.status(201).json(actor);
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});


// add a user (register)
app.post('/register', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }).then((user) => {
          res.status(201).json(user)
        }).catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        })
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// get a user by username
app.get('/users/:username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(200).json(user);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// update a user's info by username
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) // this line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.status(201).json(updatedUser);
      }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// get a user's list of favorite movies
app.get('/users/:username/favorites', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.status(201).json(user);
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// add a movie to a user's list of favorites (old url: /users/:username/favorites)
app.post('/users/:username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $addToSet: //similar to $push operator
      { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
      .then((updatedUser) => {
        res.status(201).json(updatedUser);
      }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// remove a movie from a user's list of favorites
app.delete('/users/:username/favorites/:MovieID', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    { $pull:
      { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
      .then((updatedUser) => {
        res.status(200).json(updatedUser);
      }).catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

// delete a user by username
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted');
      }
    }).catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});