const express = require('express')
const fileupload = require('express-fileupload')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

const pageController = require('./controllers/page')
const photoController = require('./controllers/photo')

const app = express()

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileupload())
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }))

app.get('/', photoController.getAll)
app.post('/photos', photoController.create)
app.get('/photos/:id', photoController.get)
app.put('/photos/:id', photoController.update)
app.delete('/photos/:id', photoController.delete)

app.get('/about', pageController.getAboutPage)
app.get('/add', pageController.getAddPage)
app.get('/photos/edit/:id', pageController.getEditPage)

const connectionString = [
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}`,
  '@cluster0.6a4vv.mongodb.net/pcat-db?retryWrites=true&w=majority'
].join('')
const connectToMongoDB = () => mongoose.connect(connectionString)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connectToMongoDB()
    console.log('Connected to the MongoDB')

    app.listen(port, () => console.log(`Listening on port ${port}`))
  } catch (err) {
    console.error(err.message)
  }
}
start()
