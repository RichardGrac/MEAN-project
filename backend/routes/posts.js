const express = require('express');

const Post = require('../models/post'); // Obtenemos nuestro modelo

const router = express.Router();

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

router.post('', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      postId: createdPost.id
    });
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
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
