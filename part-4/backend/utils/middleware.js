const User = require('../models/user');
const jwt = require('jsonwebtoken');

const logger = require('./logger');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('---');
  next();
};

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    req.token = auth.replace('Bearer ', '');
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }
  req.user = await User.findById(decodedToken.id);
  if (!req.user) {
    return res.status(404).json({ error: 'user not found' });
  }
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (e, req, res, next) => {
  logger.error(e.message);
  if (e.name === 'CastError') {
    return res.status(400).send({ e: 'malformatted id' });
  } else if (e.name === 'ValidationError') {
    return res.status(400).json({ error: e.message });
  } else if (
    e.name === 'MongoServerError' &&
    e.message.includes('E11000 duplicate key error')
  ) {
    return res.status(400).json({ error: 'expected `username` to be unique' });
  } else if (e.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' });
  } else if (e.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'token expired',
    });
  }

  next(e);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
