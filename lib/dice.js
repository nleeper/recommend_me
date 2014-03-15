var request = require('request'),
    util = require('util'),
    qs = require('querystring'),
    _ = require('underscore'),
    async = require('async');

var Dice = function(settings) {
  this._url = settings.base_url || 'https://api.dice.com';
  this._apiKey = settings.api_key;
  this._headers = { 'Authorization': util.format('apiKey %s', this._apiKey) }
}

Dice.prototype.loadAllJobs = function(cb) {
  var size = 1000;
  var page = 1;

  var client = this;
  this.getJobs({ size: 1 }, function(err, body) {
    if (err) {
      cb(err, null);
    }
    else {
        var total = body.total;
        var pages = Math.floor(total / size);
        var remainder = total % size;
        if (remainder > 0)
          pages++;

        var asyncList = [];
        for (var x = 1;x <= pages;x++) {
          asyncList.push({ page: x, size: size });
        }

        async.mapLimit(asyncList, 5,
          function(item, callback) {
            console.log(item);
            client.getJobs(item, function(err, body) {
              if (err) {
                console.error(err);
                callback(err, null);
              }
              else {
                console.log(body.page + ' - ' + body.count);
                callback(null, body.jobs);
              }
            });
          },
          function(err, results) {
            if (err) {
              console.log('final error');
              console.error(err);
              console.log(results);
              cb(err, null);
            }
            else {
              cb(null, results);
            }
          }
        );
    }
  });
}

Dice.prototype.matchJobs = function(skills, cb) {
  var size = 10000;
  var page = 1;
  var filtered = [];

  var client = this;
  this.getJobs({ size: 1 }, function(err, body) {
    if (err) {
      cb(err, null);
    }
    else {
        var total = body.total;
        var pages = Math.floor(total / size);
        var remainder = total % size;
        if (remainder > 0)
          pages++;

        var asyncList = [];
        for (var x = 1;x <= pages;x++) {
          asyncList.push({ page: x, size: size });
        }

        async.map(asyncList,
          function(item, callback) {
            console.log(item);
            client.getJobs(item, function(err, body) {
              //console.log(body);
              callback(null, body.jobs);
            });
          },
          function(err, results) {
            //console.log(results);
            cb(null, { jobs: [], total: 0, page: 1, count: 0, pageCount: 0 });
          }
        );
        //var f = me._filterResultsBySkills(body.jobs, skills);
    }
  });
}
Dice.prototype.getJobs = function(params, cb) {
  var skills = [];
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

  var me = this;
  request.get({ url: jobsUrl, headers: this._headers, json: true, timeout: 60000 }, function(err, response, body) {
    if (err) {
      cb(err, null);
    }
    else {
      cb(null, { jobs: body.searchResults, total: body.total, page: body.page, count: body.count, pageCount: body.pageCount });
    }
  });
}

Dice.prototype._filterResultsBySkills = function(searchResults, skills) {
  if (skills.length == 0)
    return searchResults;

  console.log('search results - ' + searchResults.length);
  var filteredJobs = [];
  for (var j in searchResults) {
    var job = searchResults[j];

    skills.map(function(skill) {
      skill = skill.toLowerCase();
      if (job.skills) {
        job.skills.map(function(jobSkill) {
          jobSkill = jobSkill.toLowerCase();
          if (jobSkill.indexOf(skill) > -1)
            filteredJobs.push(job);
        });
      }
    });
  }
  console.log('filtered - ' + filteredJobs.length);
  return filteredJobs;
}

module.exports = Dice;