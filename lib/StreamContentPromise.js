var util = require('util');
var Promise = require('promise');
var Writable = require('stream').Writable;

var StreamContentPromise = module.exports = function() {
    if (!(this instanceof StreamContentPromise)) return new StreamContentPromise();

    this.chunks = [];
    this.stream = new Writable();
    var self = this;

    this.stream._write = function(chunk, encoding, next) {
        self.chunks.push(chunk);
        next();
    };

    Promise.call(this, function(resolve, reject) {
        self.stream.on('finish', function() {
            var response = Buffer.concat(self.chunks).toString();
            resolve(response);
        });
        self.stream.on('error', function(error) { reject(error); });
    });
};
util.inherits(StreamContentPromise, Promise);

StreamContentPromise.prototype.getWriteStream = function() {
    return this.stream;
};
