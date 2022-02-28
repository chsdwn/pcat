const express = require('express')
const mongoose = require('mongoose')
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
app.use(pathNameLogger)

app.get('/', async (req, res) => {
  const photos = await Photo.find({})
  res.render('index', { photos })
})
app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/add', (req, res) => {
  res.render('add')
})
app.post('/photos', async (req, res) => {
  await Photo.create(req.body)
  res.redirect('/')
})
app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id)
  res.render('photo', { photo })
})

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
