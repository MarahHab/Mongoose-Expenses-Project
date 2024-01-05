const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const app = express()
const api = require('./server/routes/api')


mongoose.connect("mongodb://127.0.0.1:27017/expensesDB", {
  useNewUrlParser: true,
}).catch((err) => console.log(err)).catch((err) => console.log(err))

app.use(bodyParser.json)
app.use(bodyParser.urlencoded({extended:false}))

app.use('/', api)

const port = 2910
app.listen(port, function () {
    console.log(`Running on port ${port}`)
})