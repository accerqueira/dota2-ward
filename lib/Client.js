var url = require('url');
var util = require('util');
var request = require('request');
var zlib = require('zlib');
var Promise = require('promise');
var StreamContentPromise = require('./StreamContentPromise');
var MatchDetails = require('./MatchDetails');
var MatchSummary = require('./MatchSummary');
var MatchHistory = require('./MatchHistory');
var MatchHistoryBySequenceNum = require('./MatchHistoryBySequenceNum');

var Client = module.exports = function(clientToken, options) {
    if (!(this instanceof Client)) return new Client(clientToken, options);

    options = options || {};

    this.clientToken = clientToken;
    this.applicationId = options.applicationId || 570 || 205790;
    this.apiVersion = options.apiVersion || 1;
    this.apiInvocationPolicy = null;
};

Client.MatchDetails = MatchDetails;
Client.MatchSummary = MatchSummary;
Client.MatchHistory = MatchHistory;
Client.MatchHistoryBySequenceNum = MatchHistoryBySequenceNum;

Client.AppId = {
    'Dota2': 570,
    'Dota2Test': 205790
};

var mergeObjects = function() {
    var result = {};
    for (var i = 0; i < arguments.length; i++) {
        obj = arguments[i];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
        }
    }
    return result;
};

var oppressed = function(res) {
    var stream;
    switch (res.headers['content-encoding']) {
        case 'gzip':
            stream = res.pipe(zlib.createGunzip());
            break;
        case 'deflate':
            stream = res.pipe(zlib.createInflate());
            break;
        default:
            stream = res;
            break;
    }

    return stream;
};

Client.prototype.getUrl = function(url) {
    var headers = {'Accept-Encoding': 'gzip,deflate'};
    var req = request({'url': url, 'headers': headers});
    var result = new StreamContentPromise();

    req.on('response', function(res) {
        oppressed(res).pipe(result.getWriteStream());
    });

    return result;
};

Client.prototype.execute = function(iface, method, params) {
    var self = this;
    var apiParams = mergeObjects({ 'key': self.clientToken }, params || {});
    var apiUrl = {
        'protocol': 'https',
        'hostname': 'api.steampowered.com',
        'pathname': iface +'_'+ self.applicationId +'/'+ method +'/v'+ self.apiVersion +'/',
        'query': apiParams
    };
    apiUrl = url.format(apiUrl);

    return self.getUrl(apiUrl).then(function(response) {
        return JSON.parse(response);
    }, function(error) {
        return error;
    });
};

// http://api.steampowered.com/IDOTA2Match_<ID>/GetMatchDetails/v1
Client.prototype.getMatchDetails = function(matchId) {
    // matchId
    return this.execute('IDOTA2Match', 'GetMatchDetails', { 'match_id': matchId }).then(function (content) {
        return new MatchDetails(content.result);
    });
};

// http://api.steampowered.com/IDOTA2Match_<ID>/GetMatchHistory/v1
Client.prototype.getMatchHistory = function(filter) {
    return new MatchHistory(this.execute.bind(this, 'IDOTA2Match', 'GetMatchHistory'), filter);
};

// http://api.steampowered.com/IDOTA2Match_<ID>/GetMatchHistoryBySequenceNum/v1
Client.prototype.getMatchHistoryBySequenceNum = function(filter) {
    return new MatchHistoryBySequenceNum(this.execute.bind(this, 'IDOTA2Match', 'GetMatchHistoryBySequenceNum'), filter);
};
