var userStore = require('../../../lib/userStore');

function convertMeToUser(me) {
    var user = {
        id: me.id,
        firstName: me.firstName,
        lastName: me.lastName
    }

    user.skills = [];

    for (var i = me.skills.values.length - 1; i >= 0; i--) {
        var skill = me.skills.values[i];
        user.skills.push(skill.skill.name);
    };

    return user;
}

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
        	var user = convertMeToUser($in);
		    user.accessToken = r.access_token;
		    userStore.save(user);
            res.cookie('userId', user.id);
		    res.redirect('/');
		});
    });
};