/* Creamos una estructura (schema) */
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true},
  content: { type: String, required: true }
});

/* Crear clase modelo */
module.exports = mongoose.model('Post', postSchema);
