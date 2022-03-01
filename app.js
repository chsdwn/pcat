const express = require('express')
const fileupload = require('express-fileupload')
const fs = require('fs')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const path = require('path')
const Photo = require('./models/photo')

mongoose.connect('mongodb://localhost/pcat')

const app = express()

app.set('view engine', 'ejs')

const pathNameLogger = (req, res, next) => {
  console.log('[pathName]:', req.url)
  next()
}

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileupload())
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }))
app.use(pathNameLogger)

app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated')
  res.render('index', { photos })
})
app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/add', (req, res) => {
  res.render('add')
})
app.post('/photos', (req, res) => {
  const uploadDir = path.join('public', 'uploads')
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

  const uploadedImage = req.files.image
  const uploadPath = path.join(__dirname, 'public', 'uploads', uploadedImage.name)

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({ ...req.body, image: '/uploads/' + uploadedImage.name })
    res.redirect('/')
  })
})
app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  res.render('photo', { photo })
})
app.put('/photos/:id', async (req, res) => {
  const id = req.params.id
  const photo = await Photo.findById(id)
  photo.title = req.body.title
  photo.description = req.body.description
  await photo.save()

  res.redirect(`/photos/${id}`)
})
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  const [, folder, file] = photo.image.split('/')
  const deletedImage = path.join(__dirname, 'public', folder, file)
  fs.unlinkSync(deletedImage)
  await photo.remove()

  res.redirect('/')
})
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  res.render('edit', { photo })
})

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
