# dota2-ward

Fluent [Dota 2 WebAPI](http://wiki.teamfortress.com/wiki/WebAPI#Dota_2) client.


## Installation

```
npm install dota2-ward
```

## Usage

```javascript
var util = require('util');
var config = require('../config.json');
var dota2ward = require('../');
var client = dota2ward(config.apikey);

var filter = {
    human_players: 10,
    first_blood_time: { $gt: 0, $lt: 5*60 },
    players: { $any: { leaver_status: { $gt: 0}} }
};
client.getMatchHistoryBySequenceNum(filter).forEach(function(match) {
    console.log(util.inspect(match, {depth: null}));
});

```

## API

### new dota2ward(apikey)

Creates and retuns a new dota2ward.

### dota2ward#setAPIPolicy(policy)

Set a decorator function to control the invocation of DOTA2 WebAPI.
You can use [method-invoker](https://github.com/accerqueira/method-invoker) to build the desired decorator.

### dota2ward#getMatchDetails(matchId)

Returns a promise of MatchDetails for the requested matchId.

### dota2ward#getMatchHistory(filter)

Returns a lazy list of MatchSummary for matches that meet the [filter](https://github.com/accerqueira/object-expression). 

### dota2ward#getMatchHistoryBySequenceNum(filter)

Returns a lazy list of MatchDetails for matches that meet the [filter](https://github.com/accerqueira/object-expression). 

