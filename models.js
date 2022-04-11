const mongoose = require('mongoose'),
  bcrypt = require('bcrypt');
require('passport');

/**
 * Mongoose schema for movie objects:
 * {
 *  MovieID: {
 *    type: Number,
 *    required: true
 *  },
 *  Title: {
 *    type: String,
 *    required:true
 *  },
 *  ReleaseYear: {
 *    type: String,
 *    required: true
 *  },
 *  Description: {
 *    type: String,
 *    required: true
 *  },
 *  Genre {
 *    type: mongoose.Schema.Types.ObjectId,
 *    ref: 'Genre'
 *  },
 *  Director: {
 *    type: mongoose.Schema.Types.ObjectId,
 *    ref: 'Director'
 *  },
 *  Actors: [
 *    {
 *      type: mongoose.Schema.Types.ObjectId,
 *      ref: 'Actor'
 *    }
 *  ],
 *  ImagePath: String,
 *  Featured: Boolean
 * }
 */
let movieSchema = mongoose.Schema({
  MovieID: {
    type: Number,
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  ReleaseYear: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Genre'
  },
  Director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Director'
  },
  Actors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor'
    }
  ],
  ImagePath: String,
  Featured: Boolean
});

/**
 * Mongoose schema for genre objects:
 * {
 *  GenreID: {
 *    type: Number,
 *    required: true
 *  },
 *  Name: {
 *    type: String,
 *    required: true
 *  },
 * Description: {
 *    type: String,
 *    required: true
 *  }
 * }
 */
let genreSchema = mongoose.Schema({
  GenreID: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  }
});

/**
 * Mongoose schema for director objects:
 * {
 *  DirectorID: {
 *    type: Number,
 *    required: true
 *  },
 *  Name: {
 *    type: String,
 *    required: true
 *  },
 *  Bio: {
 *    type: String,
 *    required: true
 *  },
 *  BirthYear: {
 *    type: String,
 *    required: true
 *  },
 *  DeathYear: String,
 *  Movies: [
 *    {
 *      type: mongoose.Schema.Types.ObjectId,
 *      ref: 'Movie'
 *    }
 *  ]
 * }
 */
let directorSchema = mongoose.Schema({
  DirectorID: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  Bio: {
    type: String,
    required: true
  },
  BirthYear: {
    type: String,
    required: true
  },
  DeathYear: String,
  Movies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }
  ]
});

/**
 * Mongoose schema for actor objects:
 * {
 *  ActorID: {
 *    type: Number,
 *    required: true
 *  },
 *  Name: {
 *    type: String,
 *    required: true
 *  },
 *  BirthYear: {
 *    type: String,
 *    required: true
 *  },
 *  DeathYear: String,
 *  Movies: [
 *    {
 *      Movie: {
 *        type: mongoose.Schema.Types.ObjectId,
 *        ref: 'Movie'
 *      },
 *      Role: {
 *        type: String,
 *        required: true
 *      }
 *    }
 *  ]
 * }
 */
let actorSchema = mongoose.Schema({
  ActorID: {
    type: Number,
    required: true
  },
  Name: {
    type: String,
    required: true
  },
  BirthYear: {
    type: String,
    required: true
  },
  DeathYear: String,
  Movies: [
    {
      Movie: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie'},
      Role: {type: String, required: true}
    }
  ]
});

/**
 * Mongoose schema for user objects:
 * {
 *  Username: {
 *    type: String,
 *    required: true
 *  },
 *  Password: {
 *    type: String,
 *    required: true
 *  },
 *  Email: {
 *    type: String,
 *    required: true
 *  },
 *  Birthday: Date,
 *  FavoriteMovies: [
 *    {
 *      type: mongoose.Schema.Types.ObjectId,
 *      ref: 'Movie'
 *    }
 *  ]
 * }
 */
let userSchema = mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Birthday: Date,
  FavoriteMovies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    }
  ]
});

/**
 * Hash password with bcrypt
 * @param {string} password - password string
 * @returns {string} - password string
 */
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Validate an entered password by comparing submitted hashed password to the stored password hash
 * @param {string} password - password string
 * @returns {boolean}
 */
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.Password);
};

// create models
let Movie = mongoose.model('Movie', movieSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);
let Actor = mongoose.model('Actor', actorSchema);
let User = mongoose.model('User', userSchema);

// export models
module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.Actor = Actor;
module.exports.User = User;