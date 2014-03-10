var ObjExp = require('object-expression');

var MatchList = module.exports = function(fetcher, filter) {
    if (!(this instanceof MatchList)) return new MatchList(fetcher, filter);

    this.itemCtor = Object;
    this.matchesPerRequest = 100;

    this.fetcher = fetcher;
    this.filterExpression = new ObjExp(filter);

    this.buffer = [];
    this.bufferIndex = -1;
    this.bufferLowWaterMark = this.matchesPerRequest / 2;
    this.bufferHighWaterMark = this.matchesPerRequest * 5;
    this.bufferEnded = false;

    this.fetching = null;
};

MatchList.prototype.getNextParams = function() {
    throw new Error('Method not implemented');
};

MatchList.prototype.accept = function(filter) {
    this.filterExpression.or(filter);
};

MatchList.prototype.reject = function(filter) {
    this.filterExpression.and(ObjExp.not(filter));
};

MatchList.prototype.fetchNextBlock = function(callback) {
    if (this.fetching) {
        this.fetching.then(callback);
        return this;
    }

    var self = this;

    var params = this.getNextParams();

    this.fetching = this.fetcher(params).then(function(response) {
        self.fetching = null;
        if (response.result.matches.length === 0) {
            self.bufferEnded = true;
            return [];
        }
        Array.prototype.push.apply(self.buffer, response.result.matches);
        if (self.buffer.length > self.bufferHighWaterMark) {
            var removeCount = self.buffer.length - self.bufferHighWaterMark;
            self.buffer.splice(0, removeCount);
            self.bufferIndex -= removeCount;
        }
        return response.result.matches;
    }).then(callback);

    return this;
};

MatchList.prototype.next = function(callback) {
    var self = this;

    this.bufferIndex++;

    var returnItem = (function() {
        try {
            if (this.bufferEnded && this.bufferIndex === this.buffer.length) {
                callback(null);
                return;
            } else if (this.bufferIndex < this.buffer.length) {
                var data = this.buffer[this.bufferIndex];
                if (this.filterExpression.test(data)) {
                    var item = new this.itemCtor(data);
                    callback(item);
                } else {
                    this.bufferIndex++;
                    process.nextTick(returnItem);
                }
            } else {
                this.fetchNextBlock(returnItem);
            }

            if (!this.fetching && this.buffer.length - this.bufferIndex < this.bufferLowWaterMark) {
                this.fetchNextBlock();
            }
        } catch (ex) {
            console.error(ex.stack);
        }
    }).bind(this);

    process.nextTick(returnItem);

    return this;
};

MatchList.prototype.forEach = function(callback) {
    var self = this;

    this.next(function again(item) {
        if (item === null) return;

        var proceed = false;
        try {
            proceed = (callback(item) !== false);
        } catch (ex) {
            console.error(ex.stack);
        }

        if (!proceed) return;

        self.next(again);
    });

    return this;
};
