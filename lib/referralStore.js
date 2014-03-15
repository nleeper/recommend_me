var uuid = require('node-uuid'),
	io = require('./file-io')('referrals.json'),
	referrals = io.load({});

module.exports.getById = function(id) {
	return referrals[id];
};

module.exports.save = function(referral) {
	if (referral) {
		if (!referral.id) {
			referral.id = uuid.v4();
		}

		referrals[referral.id] = referral;
		io.save(referrals);
	}
};
