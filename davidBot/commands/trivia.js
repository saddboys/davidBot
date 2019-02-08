const addPoints = require('../scripts/addPoints')

let triviaGetPromise = function(triviaFiles, message) {

        let command = message.content.split(" ");
        // If trivia message is only one sent, return a list of all trivias
        if (command.length === 1) {
            message.channel.send("The following trivias are available: " + triviaFiles);
        } else if ((triviaFiles.indexOf(command[1].toLowerCase()) < 0)) {
            message.channel.send("Sorry! That trivia was not found. The following trivias are available: " + triviaFiles);
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

            message.channel.send("Starting trivia! There are a total of " + trivia.questions.length.toString() + " questions in this trivia...")

            return trivia;
        }
};


let triviaCorrectQuestion = function(message, trivia) {
    trivia.channel.send("Correct! " + message.author + " got the right answer.");
    //tick up question number
    trivia.currentQuestionNumber++;
    //add score
    if (trivia.score[message.author] === undefined) {
        trivia.score[message.author] = 1

    } else {
        trivia.score[message.author]++
    }
    return trivia

};

let triviaFinished = function (trivia){
    let winner = Object.keys(trivia.score).reduce((a, b) => trivia.score[a] > trivia.score[b] ? a : b);
    trivia.channel.send(winner + " has won the trivia! They have won 1000 points")
    addPoints.addPoints(winner,1000)

};

let triviaAskQuestion = function(message, trivia) {

    //load next question
    let currentQuestionID = trivia.questionOrder[trivia.currentQuestionNumber];
    if (trivia.currentQuestionNumber < trivia.questionOrder.length) {
        let question = trivia.questions[currentQuestionID];
        trivia.channel.send((trivia.currentQuestionNumber + 1).toString() + ". " + question.q)
        return question.a;
    } else {
        triviaFinished(trivia);
        //if no more questions
        return undefined
    }


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

exports.triviaGetPromise = triviaGetPromise;
exports.triviaAskQuestion = triviaAskQuestion;
exports.triviaCorrectQuestion = triviaCorrectQuestion;

    // Allow reading of !skip to skip questions and !stop to stop the trivia, disable other trivias from beginning in the mean time

    // If not, Check message to see which trivia is selected

    // Read all files in data/trivia to find the trivia selected

    // If given trivia is not available return the list again

    // If trivia does exist, load the trivia object

    // If someone gets it correct, add the correct answer to a list and give them a point



