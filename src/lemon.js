import http					from 'http';
import express				from 'express';
import socketIO				from 'socket.io';
import expressHandlebars	from 'express-handlebars';
import handlebars			from 'handlebars';
import * as constants		from './constants';

export default class Lemon {
	constructor() {
		// Set defaults
		this._properties = {
			port: 1337
		};

		// Create the Application
		this.app = express();

		// Setup socket.io
		this.server = http.Server(this.app);
		this.io = socketIO(this.server);

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
	}

	_loadMiddleware() {
		// Host the application's static files
		this.app.use(express.static(constants.STATIC_DIR));

		// Host Bootstrap's static files
		this.app.use(express.static(constants.BOOTSTRAP_DIST));
	}

	_loadRoutes() {
		this.app.get('/', (req, res) => {
			res.render('index');
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
