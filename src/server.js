const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()


// DOTENV
const dotenv = require('dotenv')
dotenv.config()


// DATABASE
const db = require('./config/db.js')
  ; (async () => {
    await db.checkConnection()
  })()


// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))


// CORS
app.use(cors())


// ROUTES
const c = require('./tokenController')
app.get('/', async (req, res) => {
  res.json({ message: 'FLXA Balance Service' })
})
app.post('/token/mint', c.mintTokenHandler)
app.get('/token/debug', c.debug)
app.get('/token/merge', c.merge)
app.post('/token/transfer', c.transfer)
app.get('/token/amount/:userId', c.getTokenAmount)
app.get('/token/bonus', c.getRedeemBonuses) // query ?operatorId=


// ROUTE ERROR HANDLING
app.use((req, res, next) => {
  const error = new Error('Not found!')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})


// SERVER
const port = process.env.PORT || 5003
app.listen(port, () => {
  console.log('Server is running!')
})



module.exports = app