var util = require('util');
var MatchList = require('./MatchList');
var MatchDetails = require('./MatchDetails');

var MatchHistoryBySequenceNum = module.exports = function(fetcher) {
    if (!(this instanceof MatchHistoryBySequenceNum)) return new MatchHistoryBySequenceNum(fetcher);

    MatchList.call(this, fetcher);

    this.itemCtor = MatchDetails;
};
util.inherits(MatchHistoryBySequenceNum, MatchList);

MatchHistoryBySequenceNum.prototype.getNextParams = function() {
    return (this.buffer.length) ? { 'start_at_match_seq_num': this.buffer[this.buffer.length - 1].match_seq_num + 1 } : {};
};
