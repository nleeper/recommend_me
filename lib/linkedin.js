module.exports = function(callbackPath) {
	return function(req, res, next) {
		console.log(global.hasOwnProperty('linkedin'));
		if (!global.hasOwnProperty('linkedin')) {
  			var linkedin = require('node-linkedin');
  			console.log(req.headers.host + callbackPath);
		  	global.linkedin = linkedin('75vkr34dnqpeed', 'FmMd2Ul1QNWjtFen', 'http://' + req.headers.host + callbackPath);
		} else {
			console.log('nope');
		}
		next();
	}
}