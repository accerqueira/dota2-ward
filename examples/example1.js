var util = require('util');
var config = require('../config.json');
var dota2ward = require('../');
var client = dota2ward(config.apikey);

var filter = {
    human_players: 10,
    first_blood_time: { $gt: 0, $lt: 5*60 },
    players: { $any: { leaver_status: { $gt: 0}} }
};
client.getMatchHistoryBySequenceNum(filter).forEach(function(match) {
    console.log(util.inspect(match, {depth: null}));
});
