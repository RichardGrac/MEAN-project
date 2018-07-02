const express = require('express');
const multer = require('multer');

const Post = require('../models/post'); // Obtenemos nuestro modelo

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images'); // Ruta relativa a server.js
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-'); // Cambiamos espacios por '-'
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
}); // Dónde Multer guardará el Archivo entrante

router.get('', (req, res, next) => {
  console.log('GET Request');
  Post.find()
    .then(documents => {
      return res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    })
    .catch((error) => {
      console.error('Error obteniendo datos, error: ', error)
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(404).json({ message: 'Post not found!' });
    });
});

// 'single' significa que está espectando un archivo y que lo extraiga de la propiedad 'image' del body
router.post('', multer({storage: storage}).single('image'), (req, res, next) => {
  //Construimos el URL de nuestro servidor
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        // Forma #1, crea Obj JSON con mismas propiedades que la respuesta 'createdPost'
        // y nada más sustituimos 'id'
        ...createdPost,
        id: createdPost._id
        // Forma #2, manualmente:
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    });
  });
});

router.put('/:id', multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  console.log(req.file);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: "Updated succesfull!"});
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({message: 'Post deleted'});
    });
});

module.exports = router;
