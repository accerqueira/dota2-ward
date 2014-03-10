var util = require('util');
var MatchList = require('./MatchList');
var MatchDetails = require('./MatchDetails');

var MatchHistoryBySequenceNum = module.exports = function(fetcher, filter) {
    if (!(this instanceof MatchHistoryBySequenceNum)) return new MatchHistoryBySequenceNum(fetcher, filter);

    MatchList.call(this, fetcher, filter);

    this.itemCtor = MatchDetails;
};
util.inherits(MatchHistoryBySequenceNum, MatchList);

MatchHistoryBySequenceNum.prototype.getNextParams = function() {
    return (this.buffer.length) ? { 'start_at_match_seq_num': this.buffer[this.buffer.length - 1].match_seq_num + 1 } : {};
};
