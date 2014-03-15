
/*
 * GET home page.
 */

exports.index = function(req, res){
  global.diceClient.getJobs({ term: 'rails', fields: ['description', 'id', 'skills', 'company', 'position'] }, function(err, body) {
    console.log(body.jobs);
    res.render('index', { title: 'Recommend Me', jobs: body.jobs });
  });
};