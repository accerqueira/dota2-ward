var MatchList = module.exports = function(fetcher) {
    if (!(this instanceof MatchList)) return new MatchList(fetcher);

    this.itemCtor = Object;
    this.matchesPerRequest = 100;

    this.fetcher = fetcher;

    this.buffer = [];
    this.bufferIndex = -1;
    this.bufferLowWaterMark = this.matchesPerRequest / 2;
    this.bufferHighWaterMark = this.matchesPerRequest * 5;
};

MatchList.prototype.getNextParams = function() {
    throw new Error('Method not implemented');
};

MatchList.prototype.fetchNextBlock = function(callback) {
    var self = this;

    var params = this.getNextParams();

    this.fetcher(params).then(function(response) {
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

    var returnItem = function() {
        var item = null;
        if (self.bufferIndex < self.buffer.length) {
            item = new self.itemCtor(self.buffer[self.bufferIndex]);
        }

        try {
            callback(item);
        } catch (ex) {
            console.error(ex.stack);
        }
    };

    this.bufferIndex++;
    if (this.bufferIndex >= this.buffer.length) {
        this.fetchNextBlock(returnItem);
    } else {
        process.nextTick(returnItem);
    }

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
