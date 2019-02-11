const addPoints = require('../scripts/addPoints');
const fs = require('fs');
const shuffle = require('../scripts/shuffle');
let currentTrivia;

/**
 * processes the incoming trivia command to choose which function to execute
 * @param message
 */
let triviaProcessor = function(message){
    if (message.content.startsWith('!trivia stop')){
        triviaStop(message);
    } else if (message.content.startsWith('!trivia score')) {
        triviaScore(message);
    } else{
        triviaStart(message);
    }
};

/**
 * Sends the current scores to the channel which requested them
 */
let triviaScore = function(message){
    if (currentTrivia !== undefined) {
        let reply = "The current trivia scoreboard: \n";
        let sortable = sort(currentTrivia.score);
        for (let i = 0; i < currentTrivia.players; i++) {
            let user = sortable[i][0];
            let userScore = sortable[i][1];
            reply = reply + (i+1).toString() + ". " + user + ": " + userScore + "\n"
        }
        message.channel.send(reply)
    } else {
        message.channel.send("There is no trivia in progress!")
    }
};

/**
 * Sets up the trivia object to one chosen by user
 * @param message - the command input by the user, beginning with !trivia
 */
let triviaStart = function(message){
    triviaPromise()
        .then(function (triviaFiles) {
            //process input string
            let command = message.content.split(" ");
            // If trivia message is only one sent, return a list of all trivias
            if (command.length === 1) {
                message.channel.send("Usage: !trivia [trivia topic] [trivia length]\n" +
                    "other commands: \n" +
                    "!trivia stop\n" +
                    "!trivia score");
                message.channel.send("The following trivias are available: " + triviaFiles);
                // If trivia does not exist, return list of trivias
            } else if ((triviaFiles.indexOf(command[1].toLowerCase()) < 0)) {
                message.channel.send("Sorry! That trivia was not found. Do '!trivia' for a list of available trivias");
                // If trivia length is not a number, return instructions
            } else if ((command.length >= 3) && (((isNaN(command[2])) || (parseInt(command[2]) <= 0)) && command[2] !== "all")){
                message.channel.send("The specified trivia length must be positive integer!!")
            } else if (currentTrivia !== undefined){
                message.channel.send("A trivia is still active! Do '!trivia stop' first");
            } else {
                currentTrivia = triviaGet(message, triviaFiles);
            }
        })
        .then(function () {
            if (currentTrivia !== undefined) {
                triviaAskQuestion(currentTrivia);
            }
        })
};

/**
 * A promise which gets all the  files within the trivia promise directory
 * @returns {Promise} - the list of all trivias in the trivia directory
 */
let triviaPromise = function() {

    return new Promise(function (resolve, reject) {let triviaList = [];

        fs.readdir('./../data/trivia/', (err, files) => {
            files.forEach(file => {
                let fileName = file.replace(".json", "");
                triviaList[triviaList.length] = fileName.toLowerCase()
            });
            resolve(triviaList)
        });
    });
};

/**
 * reads the command given by the trivia to set up the trivia chosen
 * @param message - command provided by the user
 * @returns {*}
 */
let triviaGet = function(message) {

    let command = message.content.split(" ");
    let triviaChosen = command[1];
    let trivia = require('../../data/trivia/' + triviaChosen + '.json');
    trivia['currentQuestionNumber'] = 0;

    //randomise question order
    let questionOrder = [];
    for (let i = 0; i < trivia.questions.length; i++) {
        questionOrder[i] = i;
    }

    //setup fields
    trivia['questionOrder'] = shuffle(questionOrder);
    trivia['channel'] = message.channel;
    trivia['score']={};
    trivia['players'] = 0;

    //get question length
    if ((command.length >= 3) && (!isNaN(command[2])) && (parseInt(command[2]) <= trivia.questionOrder.length)){
        trivia['triviaLength'] = parseInt(command[2]);
    } else if ((command[2] === "all") || ((!isNaN(command[2]) && (parseInt(command[2]) > trivia.questionOrder.length)))){
        trivia['triviaLength'] = trivia.questionOrder.length;
    } else {
        if (trivia.questionOrder.length < 10) {
            trivia['triviaLength'] = trivia.questionOrder.length;
        } else {
            trivia['triviaLength'] = 10;
        }
    }

    message.channel.send("Starting trivia! There are a total of " + trivia.triviaLength + " questions in this trivia...");

    return trivia;

};

/**
 * should be run whenever the user provides a correct answer
 * assigns the score to the user who answered the question
 * @param message - command provided by the user
 */
let triviaCorrectQuestion = function(message) {
    currentTrivia.channel.send("Correct! " + message.author + " got the right answer.");
    //tick up question number
    currentTrivia.currentQuestionNumber++;
    //add score to user with correct answer
    if (currentTrivia.score[message.author] === undefined) {
        currentTrivia.score[message.author] = 1;
        currentTrivia.score[message.author]['user'] = message.author;
        currentTrivia.players++;

    } else {
        currentTrivia.score[message.author]++
    }
    triviaAskQuestion();
};

/**
 * loads the next question into the trivia object
 */
let triviaAskQuestion = function() {

        //load next question
        let currentQuestionID = currentTrivia.questionOrder[currentTrivia.currentQuestionNumber];
        if (currentTrivia.currentQuestionNumber < currentTrivia.triviaLength) {
            let question = currentTrivia.questions[currentQuestionID];
            currentTrivia.channel.send((currentTrivia.currentQuestionNumber + 1).toString() + ". " + question.q);
            currentTrivia['currentAnswer'] = question.a;
        } else {
            triviaFinished();
            //if no more questions
            currentTrivia['currentAnswer'] = undefined
        }
};

/**
 * processes the score when all questions are answered
 */
let triviaFinished = function (){
    //create array of sorted users by points
    let sortable = sort(currentTrivia.score);

    //get the winner/2nd/3rd place
    let winner = sortable[0][0];
    let winnerScore = sortable[0][1];

    currentTrivia.channel.send(winner + " has won the trivia with a score of " + winnerScore.toString() +"! They have won " + (100*currentTrivia.triviaLength).toString() + " points");
    addPoints.addPoints(winner,(100*currentTrivia.triviaLength))

};

/**
 * disables the trivia object
 * @param message
 */
let triviaStop = function(message){
    if (currentTrivia !== undefined) {
        message.channel.send("Stopping trivia...");
        currentTrivia = undefined;
    } else {
        message.channel.send("There is currently no active trivia to stop!");
    }
};

/**
 * checks the message provided for a correct answer to the current trivia question
 * @param message - the message which is to be checked for the answer
 * @returns {boolean} - if the correct answer was provided in the message
 */
let triviaCheckAnswer = function(message){
    return (currentTrivia !== undefined && currentTrivia.currentAnswer !== undefined && currentTrivia.currentAnswer.includes(message.content.toLowerCase()))
};

/**
 * Sorts the scores which are input
 * @param scores - score object
 * @returns {Array} - array of sorted scores
 */
let sort = function(scores){
    //create array of sorted users by points
    let sortable = [];
    for (let user in scores) {
        sortable.push([user, scores[user]]);
    }

    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    return sortable
};

exports.triviaProcessor = triviaProcessor;
exports.triviaCorrectQuestion = triviaCorrectQuestion;
exports.triviaCheck = triviaCheckAnswer;


