const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const app = express(); // Nos retorna una aplicación de express3

mongoose.connect('mongodb+srv://richard:pfGnVBhmcXM0VyFV@cluster0-dbuxt.mongodb.net/node-angular?retryWrites=true')
  .then(() => {
    console.log('Connected to database!')
  })
  .catch((message) => {
    console.log('Connection failed! ', message);
  });

/* Para todas las peticiones entrantes, convertir la Petición en formato JSON */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* Para todas las peticiones entrantes, agregamos los headers (CORS) */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With, Content-Type, Accept")
  ;
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, PUT, OPTIONS'
  );
  next();
});

app.use('/api/posts', postsRoutes);
module.exports = app;
