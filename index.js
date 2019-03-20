try{
	const path = require('path'),
		log = require('not-log')(module),
		middleware = require('./src/common').middleware,
		parts = ['templates', 'controllers','locales', 'models', 'routes'];

	let paths = {};

	parts.forEach((item)=>{
		paths[item] = path.join(__dirname, 'src', item);
	});

	module.exports = {
		name: 'not-options',
		paths,
		getMiddleware(options){
			log.info('...options middleware');
			return middleware.bind(this);
		},
	};
}catch(e){
	console.error(e);
}
