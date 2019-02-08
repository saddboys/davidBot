const fs = require('fs')


let triviaPromise = function() {

    return new Promise(function (resolve, reject) {let triviaList = [];

        fs.readdir('./../data/trivia/', (err, files) => {
            files.forEach(file => {

                let fileName = file.replace(".json", "");
                triviaList[triviaList.length] = fileName.toLowerCase()
            })
        });

        resolve(triviaList)
    });

};

exports.triviaPromise = triviaPromise();
