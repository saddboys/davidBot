let fs = require('fs');

module.exports = message => {
    // import points data
    let pointsObj = require('../data/points.json');

    // split input command
    let command = message.content.split(" ");

    // setup slots
    let slots = [":skull:",":spades:", ":hearts:" ,":diamonds:", ":clubs:", ":boom:", ":fire:", ":punch: "];


    if (typeof pointsObj.users[message.author.id] === 'undefined' || pointsObj.users[message.author.id] === 0) {
        // if no points, then setup point obj
        pointsObj.users[message.author.id] = 100;
        message.reply("You have no points and have been given 100, to gamble please enter the command again");
        savePointsData(pointsObj);
    } else {
        if (command.length === 1) {
            message.channel.reply("Please include a number of points to gamble! Usage: '!gamble 50' ");

        } else if (isNaN(command[1] || parseInt(command[1]) <= 0 || !Number.isInteger(parseFloat(command[1])))){
            message.channel.reply("You can only gamble a positive integer!");

        } else {
            // read gambled points number
            let gambledPoints = parseInt(command[1]);

            // if user has not enough points reply
            if (pointsObj.users[message.author.id].points < gambledPoints) {
                message.channel.reply("You do not have enough points to gamble that many!")
            } else {
                // setup gamble
                let gottenPoints = 0;
                let rng = Math.floor((Math.random() * 100) + 1);
                let reply;
                if (rng>=90){
                    gottenPoints = gambledPoints*3;
                    reply = "You have rolled " + rng.toString() + " and have gotten " + (gambledPoints*2).toString() + " points"
                } else if (rng>=60){
                    gottenPoints = gambledPoints*2;
                    reply ="You have rolled " + rng.toString() + " and have gotten " + (gambledPoints).toString() + " points"
                } else if (rng < 60){
                    gottenPoints = gambledPoints*-1;
                    reply ="You have rolled " + rng.toString() + " and have lost " + (gambledPoints).toString() + " points"
                }

                pointsObj.users[message.author.id] = pointsObj.users[message.author.id]+gottenPoints;
                reply = reply + ". You now have " + pointsObj.users[message.author.id].toString() + " points";
                message.reply(reply);

                savePointsData(pointsObj);
            }
        }
    }

};

let savePointsData = function(pointsObj){
    let pointsData = JSON.stringify(pointsObj, null, " ");
    let filename = "D:\\IntellijProjects\\davidBot2\\davidBot\\data\\points.json";
    fs.writeFileSync(filename, pointsData, (err) => { if (err) throw err; });
};