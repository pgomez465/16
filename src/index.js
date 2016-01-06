import Lemon				from './lemon';

// Create the application
const lemon = new Lemon({
	sessionSecret: 'ArHbMynmpls1YY330Dma'
});

lemon.initialize();

// Start the application
lemon.start(() => {
	console.log(`Lemon server listening on port ${lemon.get('port')}`);

	// Reload the browser if we are in development module
	if (process.env.NODE_ENV !== 'production') {
		const bs = require('browser-sync').create();

		bs.init({
			files: [
				'static/'
			],
			proxy: {
				target: 'localhost:1337'
			},
			open: false,
			reloadOnRestart: true
		});
	}
});
