
/*
 * GET home page.
 */

exports.index = function(req, res){
  var page = req.query.page || 1;
  global.diceClient.matchJobs(['Rails', 'C#', '.NET'], function(err, body) {
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
