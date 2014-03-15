var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  settings = require('settings'),
  dice = require('./lib/dice');

var app = express();

// Load the config file.
var projectDir = __dirname;
var config = new settings(path.join(projectDir, 'config.js'));

// all environments
app.set('port', config.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, config.static_dir)));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (!global.hasOwnProperty('diceClient')) {
  global.diceClient = new dice(config.dice);
}

app.get('/', routes.index);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});