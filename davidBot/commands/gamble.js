let fs = require('fs');

module.exports = message => {
    // import points data
    let pointsObj = require('../../data/points.json');

    //import scripts
    let addPoints = require('../scripts/addPoints');

    // split input command
    let command = message.content.split(" ");

    // setup slots
    let slots = [":skull:",":spades:", ":hearts:" ,":diamonds:", ":clubs:", ":boom:", ":fire:", ":punch:", ":seven:", ":fleur_de_lis:"];


    if (typeof pointsObj.users[message.author] === 'undefined' || pointsObj.users[message.author] === 0) {
        // if no points, then setup point obj
        addPoints.addPoints(message.author, 100);
        message.reply("You have no points and have been given 100; to gamble, please enter the command again");

    } else {
        if (command.length === 1) {
            message.reply("Please include a number of points to gamble! Usage: '!gamble 50' ");

        } else if (isNaN(command[1]) || parseInt(command[1]) <= 0 || !Number.isInteger(parseFloat(command[1]))){
            message.reply("You can only gamble a positive integer!");

        } else {
            // read gambled points number
            let gambledPoints = parseInt(command[1]);

            // if user has not enough points reply
            if (pointsObj.users[message.author] < gambledPoints) {
                console.log(pointsObj.users[message.author].points);
                message.reply("You do not have enough points to gamble that many!")
            } else {
                // setup gamble
                let gottenPoints = 0;
                let reply;
                let gottenSlots = slotMachine(slots);

                if( gottenSlots[0] === gottenSlots[1] && gottenSlots[1] === gottenSlots[2]){
                    gottenPoints = gambledPoints*10;
                    reply = "You have rolled [" + gottenSlots.toString() +"]: Jackpot!! You have gotten " + (gottenPoints).toString() +" points."
                } else if (gottenSlots[0] === gottenSlots[1] || gottenSlots[1] === gottenSlots[2] || gottenSlots[2] === gottenSlots[0]){
                    gottenPoints = gambledPoints*3;
                    reply = "You have rolled [" + gottenSlots.toString() +"]: You have gotten " + (gottenPoints).toString() +" points."
                } else {
                    gottenPoints = gambledPoints*-1;
                    reply = "You have rolled [" + gottenSlots.toString() +"]: You have lost " + (gambledPoints).toString() +" points..."
                }

                addPoints.addPoints(message.author, gottenPoints);
                reply = reply + " You now have " + (pointsObj.users[message.author]).toString() + " points";
                message.reply(reply);
            }
        }
    }

};

let slotMachine = function(slots){
    let slotsNumber = slots.length - 1;
    let rng1 = Math.floor((Math.random() * slotsNumber));
    let rng2 = Math.floor((Math.random() * slotsNumber));
    let rng3 = Math.floor((Math.random() * slotsNumber));

    let gottenSlots = [];
    gottenSlots[0] = slots[rng1];
    gottenSlots[1] = slots[rng2];
    gottenSlots[2] = slots[rng3];
    return gottenSlots;

};

let savePointsData = function(pointsObj){
    let pointsData = JSON.stringify(pointsObj, null, " ");
    let filename = './../data/points.json';
    fs.writeFile(filename, pointsData, (err) => { if (err) throw err; });
};