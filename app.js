const express = require('express')
const fileupload = require('express-fileupload')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const pageController = require('./controllers/page')
const photoController = require('./controllers/photo')

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

app.get('/', photoController.getAll)
app.post('/photos', photoController.create)
app.get('/photos/:id', photoController.get)
app.put('/photos/:id', photoController.update)
app.delete('/photos/:id', photoController.delete)

app.get('/about', pageController.getAboutPage)
app.get('/add', pageController.getAddPage)
app.get('/photos/edit/:id', pageController.getEditPage)

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
