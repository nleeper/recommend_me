var referralStore = require('../../lib/referralStore'),
	userStore = require('../../lib/userStore');

module.exports.getById = function(req, res) {
	var referral = referralStore.getById(req.params.id);

	var results = {
		referral: referral,
		referree: userStore.getById(referral.userId),
		doneUrl: req.protocol + '://' + req.get('host') + req.originalUrl + '/done'
	};

	console.log(results);

	// should check user.id with referral.connectionId... should

	if (!!referral.complete) {
		res.render('referral-complete', { title: 'Recommend Me', results: results });
	} else {
		res.render('referral', { title: 'Recommend Me', results: results });
	}
};

module.exports.done = function(req, res) {
	// TODO - check that referral is done

	var referral = referralStore.getById(req.params.id);

	if (!referral.complete) {
		referral.complete = true;
		referralStore.save(referral);

		req.linkedin.messaging.send(
			referral.userId,
			'I recommended you',
			'Hope you get the job!',
			function(err, $in) {
				res.render('referral-complete', { title: 'Recommend Me' });
			}
		);
	} else {
		res.render('referral-complete', { title: 'Recommend Me' });
	}
}

module.exports.post = function(req, res) {
	var request = req.body;
	var referral = {
		userId: req.user.id,
		connectionId: request.connectionId,
		jobId: request.jobId,
		amount: 0.00
	};
	
	global.diceClient.getById(referral.jobId, function(err, job) {
		referralStore.save(referral);

		var referralUrl = 'http://' + req.headers.host + '/referral/' + referral.id;
		console.log(referralUrl);

		req.linkedin.messaging.send(
			referral.connectionId,
			'Please refer me for ' + job.position.title + ' at ' + job.company.name + '!',
			referralUrl,
			function(err, $in) {
				res.end();
			});
	});
};