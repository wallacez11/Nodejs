const userDb = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const fsPromises = require('fs').promises
const path = require('path')
const roles = require('../config/roles_list')


const handleAuth = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' })
    // check for duplicate username in the db
    const foundUser = userDb.users.find(person => person.username === user)
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
                { expiresIn: '30s' }
            )
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            )

            const otherUsers = userDb.users.filter(person => person.username !== foundUser.username)
            const currentUser = { ...foundUser, refreshToken }
            userDb.setUsers([...otherUsers, currentUser])

            await fsPromises.writeFile(
                path.join(__dirname, '..', 'model', 'users.json'),
                JSON.stringify(userDb.users)
            )
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