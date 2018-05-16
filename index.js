const path = require('path'),
	parts = ['templates', 'controllers','locales', 'models', 'routes'];

let paths = {};

parts.forEach((i, item)=>{
	paths[item] = path.join(__dirname, 'src', item);
});

module.exports = {
	name: 'not-options',
	paths
};
