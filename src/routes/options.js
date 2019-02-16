const MODEL_NAME = 'Options',
	ActionList = [
		'get',
		'getRaw',
		'create',
		'delete',
		'update',
		'list',
		'listAndCount',
		'listAll'
	];

const query = require('not-filter'), modCommon = require('../common');

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
modCommon.extend(modCommon.Route, module.exports, ActionList, {MODEL_NAME}, '_');
