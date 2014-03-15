exports.index = function(req, res) {
    global.linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages']);
};

exports.callback = function(req, res) {
    global.linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {
        if ( err )
            return console.error(err);

        var r = JSON.parse(results);
        var linkedin = global.linkedin.init(r.access_token);

        linkedin.people.me(function(err, $in) {
        	var skillNames = [];

 		    for (var i = $in.skills.values.length - 1; i >= 0; i--) {
		    	var skill = $in.skills.values[i];

		    	skillNames.push(skill.skill.name);
		    };
		    
		    console.log(skillNames);

		    res.end();
		});
    });
};