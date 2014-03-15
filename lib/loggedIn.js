module.exports = function() {
	return function(req, res, next) {
		if (req.cookies.userId || req.path.indexOf('/oauth') == 0) {
			next();
		} else {
			res.redirect('/oauth/linkedin');
		}
	}
}