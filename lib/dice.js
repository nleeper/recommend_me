var request = require('request'),
    util = require('util'),
    qs = require('querystring'),
    _ = require('underscore');

var Dice = function(settings) {
  this._url = settings.base_url || 'https://api.dice.com';
  this._apiKey = settings.api_key;
  this._headers = { 'Authorization': util.format('apiKey %s', this._apiKey) }
}

Dice.prototype.getJobs = function(params, cb) {
  var jobsUrl = util.format('%s/jobs', this._url);

  if (typeof params == 'function') {
    cb = params;
    params = {};
  }

  var queryParams = {};
  if (_.has(params, 'term')) {
    queryParams['q'] = params['term'];
  }
  if (_.has(params, 'fields')) {
    queryParams['fields'] = params['fields'].join(',');
  }
  if (_.has(params, 'size')) {
    queryParams['count'] = params['size'];
  }
  if (_.has(params, 'page')) {
    queryParams['page'] = params['page'];
  }

  if (_.keys(queryParams).length > 0) {
    jobsUrl += '?' + qs.stringify(queryParams);
  }

  console.log(jobsUrl);

  request.get({ url: jobsUrl, headers: this._headers, json: true}, function(err, response, body) {
    if (err) {
      cb(err, null);
    }
    else {
      var jobs = body.searchResults;
      cb(null, { jobs: jobs, total: body.total, page: body.page, count: body.count, pageCount: body.pageCount });
    }
  });
}

module.exports = Dice;