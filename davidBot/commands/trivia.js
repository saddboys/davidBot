const fs = require("fs")

module.exports = (message) => {

    var triviaChosen = null;

    triviaPromise.then(
        function (triviaList) {
            var command = message.content.split(" ")
            // If trivia message is only one sent, return a list of all trivias
            if (command.length === 1) {
                message.channel.send("The following trivias are available: " + triviaList);
            } else if ((triviaList.indexOf(command[1].toLowerCase()) < 0)) {
                message.channel.send("Sorry! That trivia was not found. The following trivias are available: " + triviaList);
            } else {
                triviaChosen = command[1];
            }
        }
    )
    return triviaChosen
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



