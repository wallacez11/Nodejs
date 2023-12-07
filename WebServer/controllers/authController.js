const userDb = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const User = require('./../model/User')




const handleAuth = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' })
    // check for duplicate username in the db
    const foundUser = await User.findOne({username: user}).exec()
    if (!foundUser) return res.sendStatus(401)

    try {
        const match = await bcrypt.compare(pwd, foundUser.password)

        if (match) {
            const roles = foundUser.roles
            // create jwt
            const acessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACESS_TOKEN_SECRET,
                { expiresIn: '1d' }
            )
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            foundUser.refreshToken = refreshToken
            const result = await foundUser.save()
            console.log(result)

            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
            res.json({ acessToken })
        } else {
            res.status(401).json({ 'failure': `user or password incorrect` })
        }
    } catch (err) {
        res.status(500).json({ 'message': err.message })
    }
}

module.exports = { handleAuth }