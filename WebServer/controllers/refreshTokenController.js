const userDb = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data}
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./../model/User')



const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    console.log(cookies.jwt)
    const refreshToken = cookies.jwt
  
    // check for duplicate username in the db
    const foundUser = await User.findOne({refreshToken}).exec()
    if (!foundUser) return res.sendStatus(403)

    try{
         acessToken = ''
            jwt.verify(
                refreshToken,process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) =>{
                    if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
                    const roles = foundUser.roles
                    acessToken =  jwt.sign(
                        {
                            "UserInfo": {
                                "username": foundUser.username,
                                "roles": roles
                            }
                        },
                        process.env.ACESS_TOKEN_SECRET,
                        { expiresIn: '30s' }
                    )
                }
            )
            res.json({acessToken})
    
    }catch(err){
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleRefreshToken}