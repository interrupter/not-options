const
	UserActions = [],
	AdminActions = [
		'get',
		'getRaw',
		'create',
		'delete',
		'update',
		'list',
		'listAndCount',
		'listAll'
	],
	MODEL_NAME = 'Options',
	MODEL_OPTIONS = {
		MODEL_NAME,
		MODEL_TITLE: 	'Опции',
		populate: {}
	};

const query = require('not-filter');
const metaExtend = require('not-meta').extend;
const metaRoute = require('not-meta').Route;

exports.before = (req) => {
	let optionsSchema = this.getModelSchema(MODEL_NAME);
	query.filter.process(req, optionsSchema);
	query.sorter.process(req, optionsSchema);
	req.sorter = {id: -1};
	query.search.process(req, optionsSchema);
	query.pager.process(req);
};

exports.after = ()=>{};

//we have only Admin level routes so, all goes with '_' prefix standart for him
metaExtend(metaRoute, module.exports, AdminActions, MODEL_OPTIONS, '_');
metaExtend(metaRoute, module.exports, UserActions, MODEL_OPTIONS, '');
