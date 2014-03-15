var io = require('./file-io')('users.json'),
	users = io.load({});

module.exports.getById = function(id) {
	return users[id];
};

module.exports.save = function(user) {
	if (user && user.id) {
		users[user.id] = user;
		io.save(users);
	}
};