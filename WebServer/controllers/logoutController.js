

const User = require('./../model/User')

const handleLogout = async (req, res) => {

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(204)
    const refreshToken = cookies.jwt
  
    // check for duplicate username in the db
    const foundUser = await User.findOne({refreshToken}).exec()
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
        return res.sendStatus(204)
    }

    foundUser.refreshToken = ''
    const result = await foundUser.save()
    console.log(result)

   res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
   res.sendStatus(204)
}

module.exports = { handleLogout}