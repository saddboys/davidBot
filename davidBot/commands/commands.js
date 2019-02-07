module.exports = message => {
    commandsList = "Commands include"

    const fs = require('fs')

    fs.readdir('./commands/', (err, files) => {
        files.forEach(file => {
            commandsList = commandsList + ", !" + file.replace(".js", "")
        })
        return message.channel.send(commandsList)
    })

}