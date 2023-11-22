console.log(global)

const os = require('os')
const path = require('path');

//importando pelo modulos
//const math = require('./math')

//importanto por spread

const {add, sub, mul, div} = require('./math')

console.log(add(2, 3))
console.log(sub(2, 3))
console.log(mul(2, 3))
console.log(div(2, 3))

// console.log(os.type())
// console.log(os.version())
// console.log(os.homedir())

// console.log(__dirname)
// console.log(__filename)

// console.log(path.dirname(__filename))
// console.log(path.parse(__filename))