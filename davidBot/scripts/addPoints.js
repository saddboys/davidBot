const fs = require('fs');
let addPoints = function(user, points){
    let pointsObj = require('../../data/points.json');

    if (typeof pointsObj.users[user] === 'undefined') {
        // if no points, then setup point obj
        pointsObj.users[user] = points;
    } else {
        pointsObj.users[user] = pointsObj.users[user] + points;
    }
    let pointsData = JSON.stringify(pointsObj, null, " ");
    let filename = './../data/points.json';
    fs.writeFile(filename, pointsData, (err) => { if (err) throw err; });

};

exports.addPoints = addPoints;
