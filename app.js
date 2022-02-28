const express = require('express')

const app = express()

app.set('view engine', 'ejs')

const pathNameLogger = (req, res, next) => {
  console.log('[pathName]:', req.url)
  next()
}

app.use(express.static('public'))
app.use(pathNameLogger)

app.get('/', (req, res) => {
  res.render('index')
})
app.get('/about', (req, res) => {
  res.render('about')
})
app.get('/add', (req, res) => {
  res.render('add')
})

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
