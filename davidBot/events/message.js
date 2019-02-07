const kick = require('../commands/kick');
const ping = require('../commands/ping');
const google = require('../commands/google');
const commands = require('../commands/commands');
const trivia = require('../commands/trivia');
const gamble = require('../commands/gamble');
module.exports = (client, message) => {


    contents = message.content;
    user = message.author;

    if (checkCommand(message, 'ping')) {
        return ping(message)

    } else if (checkCommand(message, "is")) {
        let rng = Math.floor((Math.random() * 2) + 1);
        if (rng === 1) {
            message.channel.send(`Yes`)
        } else {
            message.channel.send(`No`)
        }
    } else if (checkCommand(message, 'google')) {
        return google(message)

    } else if (checkCommand(message, 'commands')) {
        return commands(message)

    } else if (checkCommand(message, 'roll')) {
        let msg = message.content.split(" ");
        if (!isNaN(msg[1])) {
            let rng2 = Math.floor((Math.random() * parseInt(msg[1], 10)) + 1);
            message.reply("You have rolled " + rng2.toString())
        }

    } else if (checkCommand(message, 'gamble')) {
        return gamble(message)
    }
};

checkCommand = function (message, command) {
    return message.content.startsWith('!' + command)
};