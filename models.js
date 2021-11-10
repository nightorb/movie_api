const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  MovieID: {type: Number, required: true},
  Title: {type: String, required: true},
  ReleaseYear: {type: String, required: true},
  Description: {type: String, required: true},
  Genre: {type: mongoose.Schema.Types.ObjectId, ref: 'Genre'},
  Director: {type: mongoose.Schema.Types.ObjectId, ref: 'Director'},
  Actors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Actor'}],
  ImagePath: String,
  Featured: Boolean
});

let genreSchema = mongoose.Schema({
  GenreID: {type: Number, required: true},
  Name: {type: String, required: true},
  Description: {type: String, required: true}
});

let directorSchema = mongoose.Schema({
  DirectorID: {type: Number, required: true},
  Name: {type: String, required: true},
  Bio: {type: String, required: true},
  BirthYear: {type: String, required: true},
  DeathYear: String,
  Movies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let actorSchema = mongoose.Schema({
  ActorID: {type: Number, required: true},
  Name: {type: String, required: true},
  BirthYear: {type: String, required: true},
  DeathYear: String,
  Movies: [
    {
      Movie: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'},
      Role: {type: String, required: true}
    }
  ]
});

let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);
let Actor = mongoose.model('Actor', actorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Actor = Actor;
module.exports.User = User;