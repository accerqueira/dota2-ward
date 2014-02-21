dota2-ward
==========

Promise based [Dota 2 WebAPI](http://wiki.teamfortress.com/wiki/WebAPI#Dota_2) client.


Installation
------------

```
npm install dota2-webapi
```

Usage
-----

```javascript
var dota2ward = require('dota2-ward');
var client = dota2ward(APIKEY);

client.getMatchDetails(MATCH_ID).then(function(match_details) {
    // ...
});
```
