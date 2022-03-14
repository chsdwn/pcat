const Photo = require('../models/photo')
const { convertImageBufferToBase64 } = require('../utils')

exports.getAll = async (req, res) => {
  const currentPageNumber = Number(req.query.page) || 1
  const limit = 2

  const total = await Photo.find().countDocuments()

  const photos = await Photo.find({})
    .sort('-dateCreated')
    .skip((currentPageNumber - 1) * limit)
    .limit(limit)
  photos.map((photo) => (photo.image = convertImageBufferToBase64(photo.image, photo.mimetype)))

  res.render('index', { photos, currentPageNumber, pageCount: Math.ceil(total / limit) })
}

exports.get = async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  photo.image = convertImageBufferToBase64(photo.image, photo.mimetype)
  res.render('photo', { photo })
}

exports.create = async (req, res) => {
  const { data: image, mimetype } = req.files.image
  await Photo.create({ ...req.body, image, mimetype })
  res.redirect('/')
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
  await photo.remove()

  res.redirect('/')
}
