
/*
 * GET home page.
 */

exports.index = function(req, res){
  var page = req.query.page || 1;
  global.diceClient.matchJobs(['Rails', 'C#', '.NET'], function(err, body) {
    body['size'] = global.config.dice.size;
    res.render('index', { title: 'Recommend Me', results: body });
  });
};