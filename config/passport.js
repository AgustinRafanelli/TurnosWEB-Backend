const localStrategy = require('passport-local').Strategy;
const { User } = require('../models');

const localStrategyInstance = new localStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  function (email, password, done) {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        user.hash(password, user.salt).then(hashedPassword => {
          if (hashedPassword !== user.password) {
            return done(null, false);
          }
          return done(null, user);
        });
      })
      .catch(done);
  }
);

const serializeUserCb = (user, done) => {
  done(null, user.id);
};

const deserializeUserCb = (id, done) => {
  User.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(done);
};

module.exports = { localStrategyInstance, serializeUserCb, deserializeUserCb };