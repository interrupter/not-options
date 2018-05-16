import ncOptions from './ncOptions.js';

let manifest = {
	router: {
		manifest: [
			{
				paths: ['options\/([^\/]+)\/([^\/]+)', 'options\/([^\/]+)', 'options'],
				controller: ncOptions
			},
		]
	},
	menu:[{
		title: 	'Настройки',
		url: 	'/options'
	}]
};

export {
	manifest
};
