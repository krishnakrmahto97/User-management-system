const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const redis = require('redis')

// Create Redis client
const client = redis.createClient({
    port: 6379,
    host: 'redis'
})
client.on('connect', function () {
    console.log('Conncted to Redis')
})

// Set port
const port = 3000

// Init app
const app = express()

// View engine
app.engine('handlebars', exphbs({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')

// body-parser
 app.use(bodyParser.json())
 app.use(bodyParser.urlencoded({ extended: true }))

// methodOverride
app.use(methodOverride('_method'))

// Search page
app.get('/', function (req, res, next) {
    res.render('searchusers')
})

// Search processing
app.post('/users/search', function (req, res, next) {
 const id = req.body.id

 client.hgetall('users:' + id, function (err, obj) {
     if (!obj) {
         res.render('searchusers', {
             error: 'User does not exist'
         })
     } else {
         obj.id = id
         res.render('details', {
             user: obj
         })
     }
 })
})

//  Get Add user page
app.get('/users/add', function (req, res, next) {
    res.render('adduser')
})

// Process Add user
app.post('/users/add', function (req, res, next) {
    const id = req.body.id
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const email = req.body.email
    const phone = req.body.phone

    client.hset ('users:' + id, [
        'first_name', firstName,
        'last_name', lastName,
        'email', email,
        'phone', phone
    ], function (err, reply) {
        if (err) {
            return console.log(err)
        }
        console.log(reply)
        res.redirect('/')
    })
})

// Process Delete user
app.delete('/users/:id', function (req, res, next) {
    client.del('users:' + req.params.id)
    res.redirect('/')
})

app.listen(port, function () {
    console.log('Server started on ' + port)
})