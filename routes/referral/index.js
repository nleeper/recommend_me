var referralStore = require('../../lib/referralStore');

module.exports.post = function(req, res) {
	var request = req.body;

	var referral = {
		userId: req.user.id,
		connectionId: request.connectionId,
		jobId: request.jobId,
		amount: 0.00
	};

	referralStore.save(referral);

	// send message

	res.end();
};