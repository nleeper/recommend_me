
/*
 * GET home page.
 */

exports.index = function(req, res){
  var page = req.query.page || 1;
  global.diceClient.getJobs({ size: global.config.dice.size, page: page, term: 'neat' }, function(err, body) {
    body['size'] = global.config.dice.size;
    console.log(body);
    res.render('index', { title: 'Recommend Me', results: body });
  });
};