module.exports = function() {
    var chai = require('chai');
    var expect = chai.expect;

    var config = require('../config.json');
    var dota2ward = require('../../');
    var dota2types = {
        'MatchDetails': dota2ward.MatchDetails,
        'MatchSummary': dota2ward.MatchSummary,
        'MatchHistory': dota2ward.MatchHistory,
        'MatchHistoryBySequenceNum': dota2ward.MatchHistoryBySequenceNum
    };

    var scenario = {};

    this.Given(/^a dota2-ward instance$/, function(callback) {
        scenario.client = dota2ward(config.apikey, { applicationId: dota2ward.AppId.Dota2Test });
        callback();
    });

    this.Given(/^the match ID '(\d+)'$/, function(match_id, callback) {
        scenario.match_id = match_id;
        callback();
    });

    this.When(/^match details is requested$/, function(callback) {
        scenario.client.getMatchDetails(scenario.match_id).then(function(matchDetails) {
            scenario.result = matchDetails;
            callback();
        });
    });

    this.When(/^match history is requested$/, function(callback) {
        scenario.result = scenario.client.getMatchHistory();
        callback();
    });

    this.When(/^match history by sequence number is requested$/, function(callback) {
        scenario.result = scenario.client.getMatchHistoryBySequenceNum();
        callback();
    });

    this.Then(/^the result should be a (\w+)$/, function(objType, callback) {
        expect(scenario.result).to.be.an.instanceof(dota2types[objType]);
        callback();
    });

    this.Then(/^the winner should be the (\w+)$/, function(winnerTeam, callback) {
        expect(scenario.result.getWinner()).to.be.equal(winnerTeam.toLowerCase());
        callback();
    });

    this.Then(/^it should be a list of (\w+)$/, function(objType, callback) {
        scenario.result.next(function(item) {
            expect(item).to.be.an.instanceof(dota2types[objType]);
            callback();
        });
    });
};
