const userDb = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const roles = require('../config/roles_list')

const handlerNewUser = async(req, res) =>{
    const{user, pwd} = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required'})
    // check for duplicate username in the db
    const duplicate = userDb.users.find(person => person.username === user)
    if (duplicate) return res.sendStatus(409)

    try{
        const hashedPwd = await bcrypt.hash(pwd, 10)

        const newUser = {"username": user, "password": hashedPwd, "roles":[roles.User]}

        userDb.setUsers([...userDb.users, newUser])

        await fsPromises.writeFile(
            path.join(__dirname, '..','model', 'users.json'),
            JSON.stringify(userDb.users)
        )
        console.log(userDb.users)
        res.status(201).json({'sucess': `New user ${user} created!`})
    }catch(err){
        res.status(500).json({'message': err.message})
    }
}



module.exports = { handlerNewUser}