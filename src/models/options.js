try{
	const MODEL_NAME = 'Options';
	const Schema = require('mongoose').Schema;
	const metaExtend = require('not-meta').extend;
	const commonModel = require('../common/_model.js');
	const ActionList = [
		'search',
		'listAndCount',
		'loadListByIds',
		'loadList',
		'getAllAsObject'
	];
	exports.keepNotExtended = false;
	exports.thisModelName = MODEL_NAME;
	exports.thisSchema = {
		id: {
			type: String,
			searchable: true,
			required: true
		},
		value: {
			type: Schema.Types.Mixed,
			searchable: true,
			required: true
		},
		active: {
			type: Boolean,
			required: true,
			default: true
		},
	};

	exports.thisStatics = {};
	metaExtend(commonModel, exports.thisStatics, ActionList , {MODEL_NAME});
}catch(e){
	//eslint-disable-next-line no-console
	console.error(e);
}
