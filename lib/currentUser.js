var userStore = require('./userStore');

module.exports = function() {
	return function(req, res, next) {
		if (req.cookies.userId) {
			req.user = userStore.getById(req.cookies.userId);
			req.linkedin = global.linkedin.init(req.user.accessToken);
		} 
		next();
	}
}