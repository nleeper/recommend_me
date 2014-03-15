var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  settings = require('settings'),
  dice = require('./lib/dice');

var app = express();

// Load the config file.
if (!global.hasOwnProperty('projectDir')) {
  global.projectDir = __dirname;
}

if (!global.hasOwnProperty('config')) {
  global.config = new settings(path.join(global.projectDir, 'config.js'));
}

// all environments
app.set('port', global.config.port || 3000);
app.set('views', path.join(global.projectDir, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(global.projectDir, global.config.static_dir)));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (!global.hasOwnProperty('diceClient')) {
  global.diceClient = new dice(global.config.dice);
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});