var MatchSummary = module.exports = function(data) {
    if (!(this instanceof MatchSummary)) return new MatchSummary(data);

    this.value = data;
};

MatchSummary.prototype.getWinner = function() {
    return (this.value.radiant_win) ? 'radiant' : 'dire' ;
};

MatchSummary.prototype.valueOf = function() {
    return this.value;
};
