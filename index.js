const path = require('path'),
	middleware = require('./src/common').middleware,
	parts = ['templates', 'controllers','locales', 'models', 'routes'];

let paths = {};

parts.forEach((i, item)=>{
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
