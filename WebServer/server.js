const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger} = require('./middleware/logEvents')
const  errorHandler = require('./middleware/errorHandler')
const verifyJwt = require('./middleware/verifyJWT')
const cookieparser = require('cookie-parser')
const credentials = require('./middleware/credentials')

const PORT = process.env.PORT || 3500;



// custom middleware logger
app.use(logger)

//Cross Origin resource sharing

app.use(credentials)

app.use(cors(corsOptions))

// built in middleware to handle urlencoded data formdate
app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json())

app.use(cookieparser())

app.use(express.static(path.join(__dirname , '/public')))

//routes
app.use('/',require('./routes/roots'))
app.use('/register',require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
app.use(verifyJwt)
app.use('/employees',require('./routes/api/employees'))


app.all('*', (req, res) =>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))

    }else if(req.accepts('json')){
        res.json({error: "404 page not found"})

    }else{
        res.type('txt').send('404 not found')

    }
    
})


app.use(errorHandler)

app.listen(PORT, () => {console.log(`Server running on ${PORT}`)
})


