const addPoints = require('../scripts/addPoints');
const fs = require('fs');

let currentTrivia;

let triviaStart = function(message){
    triviaPromise()
        .then(function (triviaFiles) {
            currentTrivia = triviaGet(message, triviaFiles);
        })
        .then(function () {
            if (currentTrivia !== undefined) {
                triviaAskQuestion(currentTrivia);
            }
        })
};

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

let triviaGet = function(message, triviaFiles) {

        let command = message.content.split(" ");
        // If trivia message is only one sent, return a list of all trivias
        if (command.length === 1) {
            message.channel.send("Usage: !trivia [trivia topic] [trivia length]");
            message.channel.send("The following trivias are available: " + triviaFiles);
        // If trivia does not exist, return list of trivias
        } else if ((triviaFiles.indexOf(command[1].toLowerCase()) < 0)) {
            message.channel.send("Sorry! That trivia was not found. The following trivias are available: " + triviaFiles);
        // If trivia length is not a number, return instructions
        } else if ((command.length >= 3) && (((isNaN(command[2])) || (parseInt(command[2]) <= 0)) && command[2] !== "all")){
            message.channel.send("The specified trivia length must be positive integer!!")
        } else {


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
        }
};

let triviaCorrectQuestion = function(message) {
    currentTrivia.channel.send("Correct! " + message.author + " got the right answer.");
    //tick up question number
    currentTrivia.currentQuestionNumber++;
    //add score to user with correct answer
    if (currentTrivia.score[message.author] === undefined) {
        currentTrivia.score[message.author] = 1

    } else {
        currentTrivia.score[message.author]++
    }
    triviaAskQuestion(currentTrivia);
};

let triviaAskQuestion = function(trivia) {

        //load next question
        let currentQuestionID = trivia.questionOrder[trivia.currentQuestionNumber];
        if (trivia.currentQuestionNumber < trivia.triviaLength) {
            let question = trivia.questions[currentQuestionID];
            trivia.channel.send((trivia.currentQuestionNumber + 1).toString() + ". " + question.q);
            currentTrivia['currentAnswer'] = question.a;
        } else {
            triviaFinished(trivia);
            //if no more questions
            currentTrivia['currentAnswer'] = undefined
        }
};

let triviaFinished = function (trivia){
    //create array of sorted users by points
    let sortable = [];
    for (let user in trivia.score) {
        sortable.push([user, trivia.score[user]]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });

    //get the winner/2nd/3rd place
    let winner = sortable[0][0];
    let winnerScore = sortable[0][1];

    trivia.channel.send(winner + " has won the trivia with a score of " + winnerScore.toString() +"! They have won " + (100*trivia.triviaLength).toString() + " points");
    addPoints.addPoints(winner,(100*trivia.triviaLength))

};

let triviaStop = function(message){
    if (currentTrivia !== undefined) {
        message.channel.send("Stopping trivia...");
        currentTrivia = undefined;
    } else {
        message.channel.send("There is currently no active trivia to stop!");
    }
};

let triviaCheckAnswer = function(message){
    return (currentTrivia !== undefined && currentTrivia.currentAnswer !== undefined && currentTrivia.currentAnswer.includes(message.content.toLowerCase()))
};

let shuffle = function(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

exports.triviaStop = triviaStop;
exports.triviaGet = triviaGet;
exports.triviaAskQuestion = triviaAskQuestion;
exports.triviaCorrectQuestion = triviaCorrectQuestion;
exports.triviaStart = triviaStart;
exports.triviaCheck = triviaCheckAnswer;
exports.triviaObj = currentTrivia;

    // Allow reading of !skip to skip questions and !stop to stop the trivia, disable other trivias from beginning in the mean time

    // If not, Check message to see which trivia is selected

    // Read all files in data/trivia to find the trivia selected

    // If given trivia is not available return the list again

    // If trivia does exist, load the trivia object

    // If someone gets it correct, add the correct answer to a list and give them a point



