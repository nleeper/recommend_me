var request = require('request'),
    util = require('util');

var Dice = function(settings) {
  this._url = settings.base_url || 'https://api.dice.com';
  this._apiKey = settings.api_key;
  this._headers = { 'Authorization': util.format('apiKey %s', this._apiKey) }
}

Dice.prototype.getJobs = function() {
  var jobsUrl = util.format('%s/jobs', this._url);
  request.get({ url: jobsUrl, headers: this._headers, json: true}, function(err, response, body) {
    console.log(body);
  });
}

module.exports = Dice;