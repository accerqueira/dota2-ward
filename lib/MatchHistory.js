var util = require('util');
var MatchList = require('./MatchList');
var MatchSummary = require('./MatchSummary');

var MatchHistory = module.exports = function(fetcher) {
    if (!(this instanceof MatchHistory)) return new MatchHistory(fetcher);

    MatchList.call(this, fetcher);

    this.itemCtor = MatchSummary;
};
util.inherits(MatchHistory, MatchList);

MatchHistory.prototype.getNextParams = function() {
    return (this.buffer.length) ? { 'start_at_match_id': this.buffer[this.buffer.length - 1].match_id - 1 } : {};
};
