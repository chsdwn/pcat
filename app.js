const path = require('path')
const express = require('express')
const app = express()

const pathNameLogger = (req, res, next) => {
  console.log('[pathName]:', req.url)
  next()
}

app.use(express.static('public'))
app.use(pathNameLogger)

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'temp/index.html'))
})

const port = 3000
app.listen(port, () => console.log(`Listening on port ${port}`))
