var userStore = require('./userStore');

module.exports = function() {
	return function(req, res, next) {
		if (req.cookies.userId) {
			req.currentUser = userStore.getById(req.cookies.userId);
			req.linkedin = global.linkedin.init(req.currentUser.accessToken);
		} 
		next();
	}
}