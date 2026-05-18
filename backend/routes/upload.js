const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/imageUpload');
const Image = require('../models/image');

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const newImage = new Image({
      user: req.user.id,
      name: req.body.name || req.file.originalname,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    const savedImage = await newImage.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: savedImage._id,
        name: savedImage.name,
        contentType: savedImage.image.contentType,
      },
      dataUrl: `data:${savedImage.image.contentType};base64,${savedImage.image.data.toString('base64')}`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, user: req.user.id });

    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.contentType(image.image.contentType);
    res.send(image.image.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;