const express = require('express'),
  morgan = require('morgan');
const app = express();

app.use(morgan('common'));
app.use(express.static('public'));


// movies list
let topTenMovies = [
  {
    title: 'Kung Fu Panda',
    year: 2008
  },
  {
    title: 'Kung Fu Panda 2',
    year: 2011
  },
  {
    title: 'Kung Fu Panda 3',
    year: 2016
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    year: 2001
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    year: 2002
  },
  {
    title: 'Harry Potter and the Prisoner of Azkaban',
    year: 2004
  },
  {
    title: 'Harry Potter and the Goblet of Fire',
    year: 2005
  },
  {
    title: 'Harry Potter and the Order of the Phoenix',
    year: 2007
  },
  {
    title: 'Harry Potter and the Half-Blood Prince',
    year: 2009
  },
  {
    title: 'The Lion King',
    year: 1994
  },
]

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/movies', (req,res) => {
  res.json(topTenMovies);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});