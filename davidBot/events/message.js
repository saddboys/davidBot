const kick = require('../commands/kick');
const ping = require('../commands/ping');
const google = require('../commands/google');
const commands = require('../commands/commands');
const trivia = require('../commands/trivia');
const gamble = require('../commands/gamble');
const points = require('../commands/points');
const is = require('../commands/is');
const roll = require('../commands/roll');
const jason = require('../commands/jason');
const cards = require('../commands/cards');

module.exports = (client, message) => {

    console.log(message.content);
    //complex commands
    if (checkCommand(message, 'trivia')) {
        trivia.triviaProcessor(message);

    //simple commands
    } else if (message.author.id !== client.user.id && message.content.startsWith("!")) {
        if (checkCommand(message, 'ping')) {
            console.log("pinged");
            return ping(message)

        } else if (checkCommand(message, "is") || checkCommand(message, "should") || checkCommand(message, "would") || checkCommand(message, "could")) {
            return is(message)

        } else if (checkCommand(message, 'google')) {
            return google(message)

        } else if (checkCommand(message, 'commands')) {
            return commands(message)

        } else if (checkCommand(message, 'roll')) {
            return roll(message)

        } else if (checkCommand(message, 'jason')) {
            return jason(message)

        } else if (checkCommand(message, 'gamble')) {
            return gamble(message)

        } else if (checkCommand(message, 'points')) {
            return points(message)

        } else if (checkCommand(message, 'cards')){
            cards.cardsProcessor(message)

        }

    //non commands
    } else if (message.author.id !== client.user.id) {
        if (message.content === "😠") {
            message.channel.send("😠")
        } else if (message.content === "😡"){
            message.channel.send("😡")
        } else if (trivia.triviaCheck(message)) {
            trivia.triviaCorrectQuestion(message);
        }
    }

};

checkCommand = function (message, command) {
    return message.content.startsWith('!' + command)
};