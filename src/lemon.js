import http					from 'http';
import express				from 'express';
import session				from 'express-session';
import bodyParser			from 'body-parser';
import socketIO				from 'socket.io';
import expressHandlebars	from 'express-handlebars';
import handlebars			from 'handlebars';
import passport				from 'passport';
import LocalStrategy		from 'passport-local';

import * as constants		from './constants';
import User					from './models/user';

export default class Lemon {
	constructor(options = {}) {
		// Set defaults
		this._properties = Object.assign({
			port: 1337
		}, options);
	}

	initialize() {
		// Create the Application
		this.app = express();

		// Setup socket.io
		this.server = http.Server(this.app);
		this.io = socketIO(this.server);

		this.passport = passport;

		// Load configuration
		this._configure();

		// Load middleware
		this._loadMiddleware();

		// Load routes
		this._loadRoutes();

		// Load the Socket.io event handlers
		this._loadSocket();
	}

	/**
	 * Starts the application
	 */
	start(next) {
		this.server.listen(this.get('port'), next);
	}

	/**
	 * Gets a property from the application.
	 * @param  {string} name The name of the property to get.
	 * @return The property.
	 */
	get(name) {
		return this._properties[name];
	}

	/**
	 * Sets a property in the application.
	 * @param {string} name  The name of the property to set.
	 * @param value The value to set.
	 */
	set(name, value) {
		this._properties[name] = value;
	}

	_configure() {
		this.app.engine('hbs', expressHandlebars({
			handlebars,
			extname: 'hbs',
			defaultLayout: 'main',
			helpers: {
				addScript(scriptName) {
					if (!this._scripts) {
						this._scripts = [];
					}
					this._scripts.push(scriptName);
				}
			}
		}));
		this.app.set('view engine', 'hbs');

		if (process.env.NODE_ENV !== 'production') {
			this.app.set('json spaces', 2);	// Prettifies JSON
		}

		// Authentication strategies
		this.passport.use(new LocalStrategy(
			(username, password, done) => {
				new User({username})
				.fetch().then((user) => {
					if (!user) {
						return done(null, false, {message: 'Username not found'});
					}

					return user.verifyPassword(password)
					.then((valid) => {
						console.log('Verify', valid);
						if (valid) {
							return done(null, user);
						}
						else {
							return done(null, false, {message: 'Invalid password'});
						}
					});
				})
				.catch((err) => {
					return done(err);
				});
			}
		));

		this.passport.serializeUser((user, done) => {
			done(null, user.get('id'));
		});

		this.passport.deserializeUser((id, done) => {
			new User({id}).fetch().then((user) => {
				done(null, user);
			})
			.catch((err) => {
				done(err);
			});
		});
	}

	_loadMiddleware() {
		// Host the application's static files
		this.app.use(express.static(constants.STATIC_DIR));

		// Host Bootstrap's static files
		this.app.use(express.static(constants.BOOTSTRAP_DIST));

		const sessionMiddleware = session({
			name: 'lemon.sid',
			resave: true,
			saveUninitialized: true,
			secret: this.get('sessionSecret')
		});

		// Load session middleware
		this.app.use(sessionMiddleware);
		this.app.use(bodyParser.urlencoded({
			extended: false
		}));

		// Load authentication middleware
		this.app.use(this.passport.initialize());
		this.app.use(this.passport.session());

		this.io.use((socket, next) => {
			sessionMiddleware(socket.request, {}, next);
		});

		// Expose some variables as locals to the view
		this.app.use((req, res, next) => {
			res.locals.user = req.user;
			next();
		});
	}

	_loadRoutes() {
		this.app.get('/', (req, res) => {
			res.render('index');
		});

		this.app.get('/login', (req, res) => {
			res.render('login');
		});

		this.app.post('/login', (req, res, next) => {
			this.passport.authenticate('local', (err, user/*, info*/) => {
				if (err) {
					return next(err);
				}

				if (!user) {
					return res.redirect('/login');
				}

				req.logIn(user, (err) => {
					if (err) {
						return next(err);
					}

					return res.redirect('/');
				});
			})(req, res, next);
		});

		this.app.get('/logout', (req, res) => {
			req.logout();
			res.redirect('/');
		});
	}

	_loadSocket() {
		this.io.on('connection', (socket) => {
			console.log('Client connected');

			socket.on('disconnect', () => {
				console.log('Client disconnected');
			});

			socket.on('chat', (msg) => {
				console.log('Chat', msg);
			});
		});
	}
}
