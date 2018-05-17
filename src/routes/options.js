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

const log = require('not-log')(module),
	query = require('not-filter'),
	modCommon = require('../common'),
	options = require('not-config').readerForModule('options');

exports.before = (req) => {
	log.info('before options action');
	let optionsSchema = this.getModelSchema(MODEL_NAME);
	log.info('query', req.query);
	query.filter.process(req, optionsSchema);
	log.info('filter', req.filter);
	query.sorter.process(req, optionsSchema);
	req.sorter = {id: -1};
	log.info('sorter', req.sorter);
	query.search.process(req, optionsSchema);
	log.info('search', JSON.stringify(req.search, null, 4));
	query.pager.process(req);
	log.info('pager', req.pager);
};

exports.after = ()=>{};

//we have only Admin level routes so, all goes with '_' prefix standart for him
modCommon.extend(modCommon.Route, module.exports, ActionList, {MODEL_NAME}, '_');
