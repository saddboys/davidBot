module.exports =  message => {
    let pointsObj = require('../../data/points.json');

    if (typeof pointsObj.users[message.author] === 'undefined' || pointsObj.users[message.author] === 0) {
        message.reply("You have no points, please enter command !gamble to gain some points");

    } else {
        let userPoints = pointsObj.users[message.author];
        message.reply("You currently have " + userPoints.toString() +" points.")
    }
};
