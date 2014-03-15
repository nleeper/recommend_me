module.exports = function(callbackPath) {
	return function(req, res, next) {
		if (!global.hasOwnProperty('linkedin')) {
  			var linkedin = require('node-linkedin');
		  	global.linkedin = linkedin('75vkr34dnqpeed', 'FmMd2Ul1QNWjtFen', 'http://' + req.headers.host + callbackPath);
		}
		next();
	}
}