const express = require('express');
// const multer = require ('multer');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books');
const path = require('path');

mongoose.connect('mongodb+srv://alexandrelerch:Ce71J8V9RlsGoB6f@alerch.oje2evk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
// const upload = multer({ dest: 'upload/' })
// app.use(cors());

app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/books', booksRoutes);

app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, "images")));

  module.exports = app;