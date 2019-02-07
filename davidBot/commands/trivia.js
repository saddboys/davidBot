module.exports = (message, triviaFiles) => {

    let currentAnswer;

    let command = message.content.split(" ");
    // If trivia message is only one sent, return a list of all trivias
    if (command.length === 1) {
        message.channel.send("The following trivias are available: " + triviaFiles);
        return null
    } else if ((triviaFiles.indexOf(command[1].toLowerCase()) < 0)) {
        message.channel.send("Sorry! That trivia was not found. The following trivias are available: " + triviaFiles);
        return null
    } else {


        let triviaChosen = command[1];
        let trivia = require('../data/trivia/' + triviaChosen + '.json');
        trivia['currentQuestionNumber'] = 0;

        //randomise question order
        let questionOrder = [];
        for (let  i = 0; i < trivia.questions.length; i++) {
            questionOrder[i] = i;
        }

        trivia['questionOrder'] = shuffle(questionOrder);

        message.channel.send("Starting trivia! There are a total of " + trivia.questions.length.toString() + " questions in this trivia...")
    }
    return trivia

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



    // Allow reading of !skip to skip questions and !stop to stop the trivia, disable other trivias from beginning in the mean time

    // If not, Check message to see which trivia is selected

    // Read all files in data/trivia to find the trivia selected

    // If given trivia is not available return the list again

    // If trivia does exist, load the trivia object

    // If someone gets it correct, add the correct answer to a list and give them a point



