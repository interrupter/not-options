import ncOptions from './ncOptions.js';

let manifest = {
	router: {
		manifest: [
			ncOptions.getRoutes()
		]
	},
	menu:{
		side: {
			items:[{
				id: 			'system.options',
				section: 	'system',
				title: 		'Настройки',
				url: 			'/options'
			}]
		}
	}
};

export {
	manifest
};
