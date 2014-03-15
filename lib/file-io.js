var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    dataDir = util.format('%s/data', process.cwd());

function loadJsonData(file, def) {
   try {
       return JSON.parse(fs.readFileSync(file));
   }
   catch (err) {
       return def;
   }
}

function saveJsonData(file, data) {
	console.log(data);
	fs.writeFileSync(file, JSON.stringify(data));
}

module.exports = function(fileName) {
	var file = path.join(dataDir, fileName);

	return {
		save: function(data) {
			saveJsonData(file, data);
		},
		load: function(def) {
			return loadJsonData(file, def);
		}
	}

}
