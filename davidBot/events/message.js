const kick = require('../commands/kick');
const ping = require('../commands/ping');
const google = require('../commands/google');
const commands = require('../commands/commands');
const trivia = require('../commands/trivia');
const gamble = require('../commands/gamble');
const points = require('../commands/points');
const is = require('../commands/is');
const roll = require('../commands/roll')
module.exports = (client, message) => {

    let contents = message.content;
    let user = message.author;

    if (checkCommand(message, 'ping')) {
        return ping(message)
    } else if (checkCommand(message, "is")) {
        return is(message)
    } else if (checkCommand(message, 'google')) {
        return google(message)
    } else if (checkCommand(message, 'commands')) {
        return commands(message)
    } else if (checkCommand(message, 'roll')) {
        return roll(message)
    } else if (checkCommand(message, 'gamble')) {
        return gamble(message)
    } else if (checkCommand(message, 'points')){
        return points(message)
    }
};

checkCommand = function (message, command) {
    return message.content.startsWith('!' + command)
};