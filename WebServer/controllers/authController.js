const userDb = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data}
}

const bcrypt = require('bcrypt')


const handleAuth = async(req, res) => {
    const{user, pwd} = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required'})
    // check for duplicate username in the db
    const foundUser = userDb.users.find(person => person.username === user)
    if (!foundUser) return res.sendStatus(401)

    try{
        const match = await bcrypt.compare(pwd, foundUser.password)

        if(match){
            res.json({'sucess': `User ${user} is logged in !`})
        }
    }catch(err){
        res.status(500).json({'message': err.message})
    }
}

module.exports = { handleAuth}