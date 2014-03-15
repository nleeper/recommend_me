var fs = require('fs'),
    path = require('path'),
    util = require('util');

function loadJsonData(file, def) {
   try {
       return JSON.parse(fs.readFileSync(file));
   }
   catch (err) {
       return def;
   }
}

function saveJsonData(file, data) {
	fs.writeFileSync(file, JSON.stringify(data));
}

var dataDir = util.format('%s/data', process.cwd()),
	usersFile = path.join(dataDir, 'users.json')
	users = loadJsonData(usersFile, {});

module.exports.getById = function(id) {
	return users[id];
};

module.exports.save = function(user) {
	if (user && user.id) {
		users[user.id] = user;
		saveJsonData(usersFile, users);
	}
};