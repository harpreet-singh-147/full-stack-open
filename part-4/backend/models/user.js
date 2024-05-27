const mongoose = require('mongoose');

const validateUsername = {
  validator: username => username.length >= 3,
  message: props => `Username (${props.value}) must be 3 or more characters`,
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    validate: validateUsername,
  },
  name: { type: String, required: [true, 'Name is required'] },
  passwordHash: { type: String, required: [true, 'Password is required'] },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
