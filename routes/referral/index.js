var referralStore = require('../../lib/referralStore')
	;//, dice = require('./lib/dice');

module.exports.getById = function(req, res) {
	var referral = referralStore.getById(req.params.id);

	// should check user.id with referral.connectionId... should


};

module.exports.post = function(req, res) {
	var request = req.body;
	//var job = 

	var referral = {
		userId: req.user.id,
		connectionId: request.connectionId,
		jobId: request.jobId,
		amount: 0.00
	};

	referralStore.save(referral);

	req.linkedin.messaging.send(
		referral.connectionId,
		'Please refer me for ' + job.position.title + ' ' + job.company.name + '!',
		'http://' + req.headers.host + '/referral/' + referral.id,
		function(err, $in) {
			res.end();
		});
};