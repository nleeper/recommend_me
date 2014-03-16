module.exports = function(callbackPath) {
	return function(req, res, next) {
		if (!global.hasOwnProperty('linkedin')) {
  			var linkedin = require('node-linkedin');
		  	//global.linkedin = linkedin('75vkr34dnqpeed', 'FmMd2Ul1QNWjtFen', 'http://' + req.headers.host + callbackPath);

		  			  	global.linkedin = linkedin('7559w8h24h55qn', 'Ap11q1a2dnz2V03C', 'http://' + req.headers.host + callbackPath);

		}
		next();
	}
}