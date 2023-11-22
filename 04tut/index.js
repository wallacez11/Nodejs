const path = require('path')


const logEvents =  require(path.join(__dirname, 'logEvents'))

const eventEmmiter = require('events')
const { EventEmitter } = require('stream')

class MyEmmiter extends EventEmitter {}

const myEmmiter = new MyEmmiter();

myEmmiter.on('log',(msg) => {
    logEvents(msg)
})

setTimeout(() => {

    myEmmiter.emit('log', 'Log event emitted')
    
}, 2000);