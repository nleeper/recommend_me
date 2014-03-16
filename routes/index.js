var myIP = require('my-ip'),
    request = require('request'),
    firebase = require('firebase');

function getIP(req) {
  return req.headers['X-Forwarded-For'] || myIP();
}

function getZip(req, callback) {
  var ip = getIP(req);

  request('http://ip-api.com/json/' + ip, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      callback(json.zip);
    }
  });
}

function getFirebaseRef(user) {
  return new firebase(global.config.firebase.url + 'users/' + user.id);
}

function getStoredJobs(user, cb) {
  var ref = getFirebaseRef(user);
  ref.on('value', function(snapshot) {
    cb(null, snapshot.val());
  });
}

function storeJobs(user, jobs) {
  var ref = getFirebaseRef(user);
  ref.set(jobs);
}

function renderJobs(req, res, body) {
  req.linkedin.connections.retrieve(function(err, $in) {
    body.connections = $in.values;
    res.render('index', { title: 'Recommend Me', results: body });
  });
}

function setupResponse(jobs, page) {
  var response = {};
  response.total = jobs.length;
  response.size = global.config.dice.size;
  response.page = page;
  response.pageCount = calculatePageCount(response.total, response.size);
  response.jobs = sliceJobs(jobs, page, response.size);
  response.count = response.jobs.length;
  return response;
}

function calculatePageCount(total, size) {
  var pages = Math.floor(total / size);
  var rem = total % size;
  if (rem > 0)
    pages++;
  return pages;
}
function sliceJobs(jobs, page, size) {
  return jobs.slice((page -1) * size, page * size);
}

exports.index = function(req, res){
  var total = 0;
  var body = {};
  var page = (req.query.page || 1) - 0;
  var size = global.config.dice.size;

  getStoredJobs(req.user, function(err, jobs) {
    if (!jobs) {
      getZip(req, function(zip) {
        global.diceClient.matchJobs(req.user.titles, req.user.skills, zip, function(err, matchedJobs) {
          storeJobs(req.user, matchedJobs);
          renderJobs(req, res, setupResponse(matchedJobs, page));
        });
      });
    }
    else {
      renderJobs(req, res, setupResponse(jobs, page));
    }
  });
}

exports.logout = function(req, res) {
	res.clearCookie('userId');
	res.redirect('https://www.linkedin.com/secure/login?session_full_logout=&trk=hb_signout');
}
