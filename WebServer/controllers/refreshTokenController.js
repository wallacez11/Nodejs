const userDb = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data}
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')


const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt
  
    // check for duplicate username in the db
    const foundUser = userDb.users.find(person => person.refreshToken === refreshToken)
    if (!foundUser) return res.sendStatus(403)

    try{
         acessToken = ''
            jwt.verify(
                refreshToken,process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) =>{
                    if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
                    acessToken = jwt.sign(
                        {"username":decoded.username},
                        process.env.ACESS_TOKEN_SECRET,
                        {expiresIn: '30s'}
                ) 
                }
            )
            res.json({acessToken})
    
    }catch(err){
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleRefreshToken}