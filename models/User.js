const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

// UserSchema.methods.encryptPassword = async function (password) {
//   const salt = await bcrypt.genSalt(10)
//   return await bcrypt.hash(password, salt)
// }

// UserSchema.methods.comparePassword = function (password) {
//   return bcrypt.compare(password, this.password)
// }

module.exports = mongoose.model('User', UserSchema)