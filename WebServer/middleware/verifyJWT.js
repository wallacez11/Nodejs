const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJwt = (req, res, next) =>{
    const authHeader = req.headers['authorization']
    if(!authHeader)return res.sendStatus(401)
    const token = authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACESS_TOKEN_SECRET,
        (err, decoded) =>{
            if(err) return res.sendStatus(403)
            req.user = decoded.username
            next()
        }
    )

}

module.exports = verifyJwt