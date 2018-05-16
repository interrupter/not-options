const MODEL_NAME = 'Options';

const log = require('not-log')(module),
	query = require('not-filter'),
	options = require('not-config').readerForModule('options');

exports.before = (req) => {
	log.info('before options action');
	let optionsSchema = this.getModelSchema(MODEL_NAME);
	log.info('query', req.query);
	query.filter.process(req, optionsSchema);
	log.info('filter', req.filter);
	query.sorter.process(req, optionsSchema);
	req.sorter = {priority:-1};
	log.info('sorter', req.sorter);
	query.search.process(req, optionsSchema);
	log.info('search', JSON.stringify(req.search, null, 4));
	query.pager.process(req);
	log.info('pager', req.pager);
};

exports.after = ()=>{};

exports._get = exports._getRaw = (req, res)=>{};
exports._list = (req, res)=>{};
exports._listAll = (req, res)=>{};
exports._listAndCount = (req, res)=>{};
exports._create = (req, res)=>{};
exports._update = (req, res)=>{
	let id = req.params._id,
		thisModel = this.getModel(MODEL_NAME);
	delete req.body._id;
	thisModel.findOneAndUpdate({
		_id: id,
	}, req.body)
		.then(item => {
			res.status(200).json(item);
		})
		.catch((err)=>{
			log.error(err);
			res.status(500).json({});
		});
};
