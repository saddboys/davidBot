const fs = require("fs")

module.exports = (message) => {

    var currentAnswer
    var triviaStarted = false

    triviaPromise.then(
        function (triviaList) {
            var command = message.content.split(" ")
            // If trivia message is only one sent, return a list of all trivias
            if (command.length === 1) {
                message.channel.send("The following trivias are available: " + triviaList);
            } else if ((triviaList.indexOf(command[1].toLowerCase()) < 0)) {
                message.channel.send("Sorry! That trivia was not found. The following trivias are available: " + triviaList);
            } else {


                var triviaChosen = command[1];
                var trivia = require('../data/trivia/' + triviaChosen + '.json');
                trivia['currentQuestionNumber'] = 0

                //randomise question order
                var questionOrder = []
                for (var i = 0; i < trivia.questions.length; i++) {
                    questionOrder[i] = i;
                }

                var randomQuestionOrder = shuffle(questionOrder)
                trivia['questionOrder'] = randomQuestionOrder

                message.channel.send("Starting trivia! There are a total of " + trivia.questions.length.toString() + " questions in this trivia...")

                triviaStarted = true;
                chooseQuestion(trivia)
            }
        }
    )



    var chooseQuestion = function (trivia) {
        var currentQuestion = trivia.questions[trivia.questionOrder[trivia.currentQuestionNumber]]
        trivia.currentQuestionNumber = trivia.currentQuestionNumber++
        message.channel.send(currentQuestion.q)
        currentAnswer = currentQuestion.a
    }

}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
}

var triviaPromise = new Promise(function (resolve, reject) {
    var triviaList = []

    fs.readdir('./data/trivia/', (err, files) => {
        files.forEach(file => {

            var fileName = file.replace(".json", "")
            triviaList[triviaList.length] = fileName.toLowerCase()
        })
    })

    resolve(triviaList)
})

    // Allow reading of !skip to skip questions and !stop to stop the trivia, disable other trivias from beginning in the mean time

    // If not, Check message to see which trivia is selected

    // Read all files in data/trivia to find the trivia selected

    // If given trivia is not available return the list again

    // If trivia does exist, load the trivia object

    // If someone gets it correct, add the correct answer to a list and give them a point



