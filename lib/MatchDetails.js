var MatchDetails = module.exports = function(data) {
    if (!(this instanceof MatchDetails)) return new MatchDetails(data);

    this.value = data;
};

MatchDetails.prototype.getWinner = function() {
    return (this.value.radiant_win) ? 'radiant' : 'dire' ;
};

MatchDetails.prototype.valueOf = function() {
    return this.value;
};
