require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT;

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

mongoose.set('strictQuery', false);

const validateTitle = {
  validator: title => title.length >= 2,
  message: props => `Title (${props.value}) must be 2 or more characters`,
};

const validateAuthor = {
  validator: author => author.length >= 3,
  message: props => `Author (${props.value}) must be 2 or more characters`,
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

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose
  .connect(mongoUrl)
  .then(() => console.log('connected to MongoDB'))
  .catch(e => console.log(`error connecting to MongoDb: ${e.message}`));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/api/blogs', (req, res, next) => {
  Blog.find({})
    .then(blogs => {
      res.json(blogs);
    })
    .catch(e => next(e));
});

app.post('/api/blogs', (req, res, next) => {
  const blog = new Blog(req.body);

  blog
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(e => next(e));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (e, req, res, next) => {
  console.error(e.message);
  if (e.name === 'CastError') {
    return res.status(400).send({ e: 'malformatted id' });
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  }

  next(e);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
