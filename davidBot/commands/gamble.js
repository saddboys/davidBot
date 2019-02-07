module.exports = message => {

    var command = message.content.split(" ")
    var slots = [":skull:",":spades:", ":hearts:" ,":diamonds:", ":clubs:", ":boom:", ":fire:", ":punch: "]
    // If trivia message is only one sent, return a list of all trivias

    if (command.length === 1) {
        message.channel.send("Please include a number of points to gamble! Usage: '!gamble 50' ");
    } else if (isNaN(command[1])) {
        message.channel.send("Specify a *number* to gamble");
    } else if (parseInt(command[1]) <= 0 | !Number.isInteger(parseFloat(command[1]))){
        message.channel.send("You can only gamble a positive integer!");
    } else {
        var gambledPoints = parseInt(command[1])
        var pointsObj = require('../data/points.json')
        if (typeof pointsObj[message.author.id] === 'undefined') {
            console.log("success")
            pointsObj[message.author.id].points = 100
        } 
        if (pointsObj[message.author.id].points < gamblePoints) {
            message.channel.send("You do not have enough points to gamble that many!")
        }
        

    }

}