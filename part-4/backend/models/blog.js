const mongoose = require('mongoose');

const validateTitle = {
  validator: title => title.length >= 2,
  message: props => `Title (${props.value}) must be 2 or more characters`,
};

const validateAuthor = {
  validator: author => author.length >= 3,
  message: props => `Author (${props.value}) must be 3 or more characters`,
};

const validateUrl = {
  validator: url => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url),
  message: props => `${props.value} is not a valid Url`,
};

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    validate: validateTitle,
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    validate: validateAuthor,
  },
  url: {
    type: String,
    required: [true, 'Url is required'],
    validate: validateUrl,
  },
  likes: {
    type: Number,
    default: 0,
    min: 0,
    validate: { validator: Number.isInteger },
  },
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);
