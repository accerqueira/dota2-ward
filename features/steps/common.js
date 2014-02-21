module.exports = function() {
    var chai = require('chai');
    var expect = chai.expect;

    var config = require('../config.json');
    var dota2ward = require('../../');
    var dota2types = {
        'MatchDetails': dota2ward.MatchDetails
    };

    var client = dota2ward(config.apikey, { applicationId: dota2ward.AppId.Dota2Test });

    var scenario = {};

    this.Given(/^the match ID '(\d+)'$/, function(match_id, callback) {
        scenario.match_id = match_id;
        callback();
    });

    this.When(/^match details is requested$/, function(callback) {
        client.getMatchDetails(scenario.match_id).then(function(match_details) {
            scenario.result = match_details;
            callback();
        });
    });

    this.Then(/^the result should be a (\w+)$/, function(objType, callback) {
        expect(scenario.result).to.be.an.instanceof(dota2types[objType]);
        callback();
    });

    this.Then(/^the winner should be the (\w+)$/, function(winnerTeam, callback) {
        expect(scenario.result.getWinner()).to.be.equal(winnerTeam.toLowerCase());
        callback();
    });
};
