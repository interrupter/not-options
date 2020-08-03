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
	menu:{
		side: {
			items:[{
				section: 'system',
				title: 	'Настройки',
				url: 	'/options'
			}]
		}
	}
};

export {
	manifest
};
