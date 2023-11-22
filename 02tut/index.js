const fsPromisses = require('fs').promises;
const path = require('path');

// fs.readFile(path.join(__dirname, 'files','starter.txt'), 'utf8', (err, data) => {
//     if(err) throw err;
//     console.log(data)
// })

const fileOps = async ()=> {
    try {
        const data = await fsPromisses.readFile(path.join(__dirname, 'files','newreply.txt'), 'utf8')
        console.log(data)
        await fsPromisses.unlink(path.join(__dirname, 'files','newreply.txt'), data)
 
        await fsPromisses.writeFile(path.join(__dirname, 'files','promiseWrite.txt'), data)
        await fsPromisses.appendFile(path.join(__dirname, 'files','promiseWrite.txt'), '\n\n Nice to meet you.')
        await fsPromisses.rename(path.join(__dirname, 'files','promiseWrite.txt'), path.join(__dirname, 'files','newPromiseWriteComplete.txt'))

        const newData = await fsPromisses.readFile(path.join(__dirname, 'files','newPromiseWriteComplete.txt'), 'utf8')
        console.log(newData)
    } catch (error) {
        console.log(error)
    }
}

fileOps()


// Callback Hell
// fs.writeFile(path.join(__dirname, 'files','reply.txt'), 'Writing in a file with node js', (err) => {
//     if(err) throw err;
//     console.log("Write complete")

//     fs.appendFile(path.join(__dirname, 'files','reply.txt'), '\n\n did you liked?', (err) => {
//         if(err) throw err;
//         console.log("Append complete")

//         fs.rename(path.join(__dirname, 'files','reply.txt'), path.join(__dirname, 'files','newreply.txt'), (err) => {
//             if(err) throw err;
//             console.log("Rename complete")
//         })
//     })
// })



// caso ocorra erro
process.on('uncaughtException', err =>{
    console.error(`There was a uncaught error: ${err}`)
    process.exit(1)
})