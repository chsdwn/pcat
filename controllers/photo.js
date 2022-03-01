const fs = require('fs')
const path = require('path')
const Photo = require('../models/photo')

exports.getAll = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated')
  res.render('index', { photos })
}

exports.get = async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  res.render('photo', { photo })
}

exports.create = (req, res) => {
  const uploadDir = path.join('public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

  const uploadedImage = req.files.image
  const uploadPath = path.join(__dirname, '..', 'public', 'uploads', uploadedImage.name)

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({ ...req.body, image: '/uploads/' + uploadedImage.name })
    res.redirect('/')
  })
}

exports.update = async (req, res) => {
  const id = req.params.id
  const photo = await Photo.findById(id)
  photo.title = req.body.title
  photo.description = req.body.description
  await photo.save()

  res.redirect(`/photos/${id}`)
}

exports.delete = async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  const [, folder, file] = photo.image.split('/')
  const deletedImage = path.join(__dirname, '..', 'public', folder, file)
  fs.unlinkSync(deletedImage)
  await photo.remove()

  res.redirect('/')
}
