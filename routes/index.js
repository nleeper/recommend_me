var myIP = require('my-ip'),
    request = require('request');

function getIP(req) {
  return req.headers['X-Forwarded-For'] || myIP();
}

function getZip(req, res, callback) {
  var ip = getIP(req);

  request('http://ip-api.com/json/' + ip, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var json = JSON.parse(body);
      callback(req, res, json.zip);
    }
  });
}

exports.index = function(req, res){
  getZip(req, res, function(zip) {
    console.log(zip);
      var page = req.query.page || 1;
      global.diceClient.matchJobs(req.user.titles, req.user.skills, 50321, function(err, body) {
        body['size'] = global.config.dice.size;
        body.connections = req.linkedin.connections.retrieve(function(err, $in) {
          body.connections = $in.values;
          res.render('index', { title: 'Recommend Me', results: body });
        });
      });
  });
};

exports.logout = function(req, res) {
	res.clearCookie('userId');
	res.redirect('https://www.linkedin.com/secure/login?session_full_logout=&trk=hb_signout');
}
