module.exports =  message => {
    let pointsObj = require('../data/points.json');
    let userPoints = pointsObj.users[message.author.id];

    message.reply("You currently have " + userPoints.toString() +" points.")
}