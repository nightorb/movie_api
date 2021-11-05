const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));
app.use(morgan('common'));

// movies list
let topTenMovies = [
  {
    title: 'Kung Fu Panda',
    year: 2008,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Kung Fu Panda 2',
    year: 2011,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Kung Fu Panda 3',
    year: 2016,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    year: 2001,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    year: 2002,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    year: 2004,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    year: 2005,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Harry Potter and the Order of the Phoenix',
    year: 2007,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'Harry Potter and the Half-Blood Prince',
    year: 2009,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
  {
    title: 'The Lion King',
    year: 1994,
    genre: ['Animation', 'Action', 'Adventure'],
    director: ['Mark Osborne','John Stevenson']
  },
]

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
})

app.get('/movies', (req,res) => {
  res.json(topTenMovies);
});

app.get('/movies/:title', (req, res) => {
  res.send('Successful GET request returning data about a single movie by its name.');
});

app.get('/genres', (req, res) => {
  res.send('Successful GET request returning a list of all genres.');
});

app.get('/genres/:genre', (req, res) => {
  res.send('Successful GET request returning data about a genre by its name.');
});

app.get('/directors', (req, res) => {
  res.send('Successful GET request returning a list of all directors.');
});

app.get('/directors/:name', (req, res) => {
  res.send('Successful GET request returning information about a director by name.');
});

app.get('/actors/', (req, res) => {
  res.send('Successful GET request returning a list of all actors.');
});

app.get('/actors/:name', (req, res) => {
  res.send('Successful GET request returning information about a actor by name.');
});

app.post('/register', (req, res) => {
  res.send('Successful POST request a new user registered.');
});

app.get('/users/:username', (req, res) => {
  res.send('Successful GET request return information about a user by username.')
})

app.put('/users/:username', (req, res) => {
  res.send('Successful PUT request user information updated.');
});

app.get('/users/:username/favorites', (req, res) => {
  res.send('Successful GET request return a list of a user\'s favorite movies.');
});

app.post('/users/:username/favorites', (req, res) => {
  res.send('Successful POST request new favorite movie added.');
});

app.delete('/users/:username/favorites', (req, res) => {
  res.send('Successful DELETE request removed movie from favorites.');
});

app.delete('/users/:username', (req, res) => {
  res.send('Successful DELETE request removed user from the database.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});