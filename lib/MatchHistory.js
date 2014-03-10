var util = require('util');
var MatchList = require('./MatchList');
var MatchSummary = require('./MatchSummary');

var MatchHistory = module.exports = function(fetcher, filter) {
    if (!(this instanceof MatchHistory)) return new MatchHistory(fetcher, filter);

    MatchList.call(this, fetcher, filter);

    this.itemCtor = MatchSummary;
};
util.inherits(MatchHistory, MatchList);

MatchHistory.prototype.getNextParams = function() {
    return (this.buffer.length) ? { 'start_at_match_id': this.buffer[this.buffer.length - 1].match_id - 1 } : {};
};
