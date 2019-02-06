const kick = require('../commands/kick')
const ping = require('../commands/ping')
const google = require('../commands/google')
const commands = require('../commands/commands')
const trivia = require('../commands/trivia')

module.exports = (client, message) => {


    contents = message.content;
    user = message.author
    /*if (checkCommand(message, 'kick')) {
        return kick(message)
    } else */if (checkCommand(message, 'ping')) {
        return ping(message)
    } else if (checkCommand(message, "is")) {
        var rng = Math.floor((Math.random() * 2) + 1);
        if (rng === 1) {
            message.channel.send(`Yes`)
        } else {
            message.channel.send(`No`)
        }
    } else if (checkCommand(message, 'google')) {
        return google(message)
    } else if (checkCommand(message, 'commands')) {
        //return commands(message)
    } else if (checkCommand(message, 'trivia')) {
        //return trivia(message)
    } else if (checkCommand(message, 'check')) {
        // console.log(triviaStatus)
    } else if (checkCommand(message, 'roll')) {
        var msg = message.content.split(" ")


    }
}

checkCommand = function (message, command) {
    return message.content.startsWith('!' + command)
}