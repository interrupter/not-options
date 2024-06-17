try{
	const path = require('path'),
		log = require('not-log')(module),
		middleware = require('./src/common').middleware,
		parts = ['controllers','locales', 'models', 'routes', 'fields'];

	let paths = {};

	parts.forEach((item)=>{
		paths[item] = path.join(__dirname, 'src', item);
	});

	module.exports = {
		name: require('./src/const').MODULE_NAME,
		paths,
		getMiddleware(){
			log?.info('...options middleware');
			return middleware.bind(this);
		},
	};
}catch(e){
	console.error(e);
}
