var config = require('./config');

if(!config.debug) {
	require('newrelic');
}

var path = require('path');
var loader = require('loader');
var express = require('express');
var session = require('express-session');
var passport = require('passport');

require('./models');

var gitHubStrategy = require('passport-github').Strategy;
var gitHubStrategyMiddleware = require('./middlewares/github_strategy');

var webRouter = require('./web_router');
var apiRouterV1 = require('./api_router_v1');

var auth = require('./middlewares/auth');

var mongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');

var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var cors = require('cors');

var staticDir = path.join(__dirname, 'public');

// assets
var assets = {};

if(config.mini_assets) {
	try {
		assets = require('./assets.json');
	} catch(e) {
		console.log('You must execute `make build` before start app when mini_assets is true.');
		throw e;
	}
}


var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.locals._layoutFile = 'layout.html';

app.use(require('response-time')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('method-override')());
app.use(compress());

app.use(session({
	secret: config.session_secret,
	store: new MongoStore({
		url: config.db
	}),
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());


app.use(auth.authUser);
app.use(auth.blockUser);


app.use(loader, less(__dirname));
app.use('/public', express.static(staticDir));

if(!config.debug) {
	app.use(function(req, res, next) {
		if(req.path.indexOf('/api') === -1) {
			csurf()(req, res, next);
			return;
		}
		next();
	});
	
	app.set('view cache', true);
}

_.extend(app.locals, {
	config: config, 
	loader: loader,
	assets: assets
});

_.extend(app.locals, require('./common/render_helper'));

app.use(function(req, res, next) {
	res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
	next();
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

passport.use(new gitHubStrategy(config.GITHUB_OAUTH, githubStrategyMiddleware));

app.use(busboy({
	limits: {
		fileSize: 10 * 1024 * 1024
	}
}));

app.use('/', webRouter);
app.use('/api/v1', cors(), apiRouterV1);

if(config.debug) {
	app.use(errorhandler());
}
else {
	app.use(function(err, req, res, next) {
		return res.status(500).send('500 status');
	});
}

app.listen(config.port, function() {
	console.log('cLife listening on port %d in %s mode', config.port, app.setting.env);
	console.log('You can debug your app with http://' + config.hostname + ":" + config.port);
});

module.exports = app;
