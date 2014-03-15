
/*
 * GET home page.
 */

exports.index = function(req, res){
  global.diceClient.getJobs();
  res.render('index', { title: 'Express' });
};