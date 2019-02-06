/*module.exports = message => {
    commandsList = ""

    const fs = require('fs')

    fs.readdir('./events/', (err, files) => {
        files.forEach(file => {
            commandsList = commandsList + ", !" + file.replace(".js", "")
        })
    })
    return message.channel.send(commandsList)
}*/