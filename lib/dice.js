var request = require('request'),
    util = require('util'),
    qs = require('querystring'),
    _ = require('underscore'),
    async = require('async'),
    S = require('string');

var Dice = function(settings) {
  this._url = settings.base_url || 'https://api.dice.com';
  this._apiKey = settings.api_key;
  this._headers = { 'Authorization': util.format('apiKey %s', this._apiKey) }
}

Dice.prototype.matchJobs = function(titles, skills, zipCode, cb) {
  var titles = this._filterTitles(titles);

  var titleQuery = titles.join(' ');

  var me = this;
  this.getJobs({ size: 500, term: titleQuery, location: zipCode, fields: ['id', 'skills', 'description', 'company', 'position'] }, function(err, body) {
    var jobs = [];
    var filteredJobs = me._filterResultsBySkills(body.jobs, skills);

    filteredJobs.map(function(j) {
      jobs.push(j.job);
    });

    cb(null, { jobs: jobs, total: jobs.length, page: 1, pageCount: 1, count: 10 });
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
  if (_.has(params, 'location')) {
    queryParams['location'] = params['location'];
  }

  if (_.keys(queryParams).length > 0) {
    jobsUrl += '?' + qs.stringify(queryParams);
  }

  console.log(jobsUrl);

  request.get({ url: jobsUrl, headers: this._headers, json: true, timeout: 60000 }, function(err, response, body) {
    if (err) {
      cb(err, null);
    }
    else {
      cb(null, { jobs: body.searchResults, total: body.total, page: body.page, count: body.count, pageCount: body.pageCount });
    }
  });
}

Dice.prototype._filterTitles = function(titles) {
  var filteredTitles = [];

  var words = {};
  titles.map(function(title) {
    title = S(title).trim().toLowerCase().s;

    var spaceSplit = title.split(' ');
    spaceSplit.map(function(w) {
      var slashSplit = w.split('/');

      slashSplit.map(function(l) {
        var count = 1;
        if (_.has(words, l))
          count = words[l] + 1;

        words[l] = count;
      });
    })
  });

  _.keys(words).map(function(k) {
    if (words[k] > 1)
      filteredTitles.push(k);
  });

  return filteredTitles;
}

Dice.prototype._filterResultsBySkills = function(searchResults, skills) {
  if (skills.length == 0)
    return searchResults;

  var filteredJobs = {};
  for (var j in searchResults) {
    var job = searchResults[j];

    skills.map(function(skill) {
      skill = skill.toLowerCase();
      if (job.skills) {
        job.skills.map(function(jobSkill) {
          jobSkill = jobSkill.toLowerCase();
          if (jobSkill.indexOf(skill) > -1) {
            var count = 1;
            if (_.has(filteredJobs, job.id))
              filteredJobs[job.id].count++;
            else
              filteredJobs[job.id] = { job: job, count: 1 };
          }
        });
      }
    });
  }

  var sorted = [];
  _.keys(filteredJobs).map(function(k) {
    var job = filteredJobs[k];
    sorted.push(job);
  });

  return sorted.sort(function(a, b) {
    return b.count - a.count;
  });
}

module.exports = Dice;