const User = require('./models/User')
const LocalStrategy = require('passport-local').Strategy

async function authenticateUser(email, password, done) {
  try {
    const user = await User.findOne({ email: email }).exec()
    if (!user) return done(null, false, { message: 'Incorrect email.' })
    if (!user.password == password) return done(null, false, { message: 'Incorrect password.' })
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

const strategy = new LocalStrategy({ usernameField: 'email' }, authenticateUser)

module.exports = strategy

module.exports = (passport) => {
  passport.use(strategy)

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).exec()
      done(null, user)
    } catch (err) {
      done(err)
    }
  })
}