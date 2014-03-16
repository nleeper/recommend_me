
/*
 * GET home page.
 */
var myIP = require('my-ip'),
  httpsync = require('httpsync');

function getIP(req) {
  var ipAddress = req.headers['X-Forwarded-For'] || myIP();//req.connection.remoteAddress;
  console.log(ipAddress);
  return ipAddress;
}

function getZip(req) {
  var ip = getIP(req);
  var req = httpsync.get({ url : 'http://ip-api.com/json/' + ip});
  var res = req.end();
  var json = JSON.parse(res.data.toString());
  console.log(json.zip);
  return json.zip;
}

exports.index = function(req, res){
  var zip = getZip(req);

  var page = req.query.page || 1;
  global.diceClient.matchJobs(req.user.titles, req.user.skills, zip, function(err, body) {
    body['size'] = global.config.dice.size;
    body.connections = req.linkedin.connections.retrieve(function(err, $in) {
    	body.connections = $in.values;
    	res.render('index', { title: 'Recommend Me', results: body });
    });
  });
};

exports.logout = function(req, res) {
	res.clearCookie('userId');
	res.redirect('https://www.linkedin.com/secure/login?session_full_logout=&trk=hb_signout');
}
