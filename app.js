const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const redis = require('redis')

// Set port
const port = 3000
// Init app
const app = express()
// View engine
app.engine('hbs', hbs({defaultlayout: 'main'}))
app.set('view engine', 'hbs')
// body-parser
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded())

// methodOverride
app.use(methodOverride('_method'))

app.get('/', function (req, res){
    res.render('searchuser s')
})

app.listen(port, function () {
    console.log('Server started on ' + port)
})