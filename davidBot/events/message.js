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

// promises
const getTriviaFiles = require('../scripts/getTriviaFiles');

let currentTrivia;
let currentAnswer;

module.exports = (client, message) => {
    if (checkCommand(message, 'ping')) {
        return ping(message)

    } else if (checkCommand(message, "is")||checkCommand(message, "should")||checkCommand(message, "would")||checkCommand(message, "could")) {
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

    } else if (checkCommand(message, 'points')){
        return points(message)

    } else if (checkCommand(message, 'trivia')){
        if (checkCommand(message, 'trivia stop') && currentTrivia !== undefined){
            currentTrivia = trivia.triviaStop(message);
        } else {
            getTriviaFiles.triviaPromise
                .then(function (triviaFiles) {
                    currentTrivia = trivia.triviaGet(message, triviaFiles);
                })
                .then(function () {
                    if (currentTrivia !== undefined) {
                        currentTrivia.currentAnswer = trivia.triviaAskQuestion(currentTrivia);
                    }
                })
        }

    } else if (currentTrivia !== undefined && currentTrivia.currentAnswer.includes(message.content.toLowerCase())){

        currentTrivia = trivia.triviaCorrectQuestion(message, currentTrivia);
        if (currentTrivia.currentAnswer === undefined){
            currentTrivia = undefined;
        }

    } else if (checkCommand(message, 'status')){
        console.log(currentTrivia);
        console.log(currentTrivia.currentAnswer);
    } else if (message.content === "😠" && message.author.id!=="542098209175240737"){
        message.channel.send("😠")
    }
};

checkCommand = function (message, command) {
    return message.content.startsWith('!' + command)
};