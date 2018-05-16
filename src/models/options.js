const MODEL_NAME = 'Options';
const Schema = require('mongoose').Schema;
const modCommon = require('../common');
exports.keepNotExtended = false;
exports.thisModelName = MODEL_NAME;
exports.thisSchema = {
	id: {
		type: String,
		searchable: true,
		required: true
	},
	title: {
		type: String,
		searchable: true,
		required: true
	},
	value: {
		type: String,
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

modCommon.extend(modCommon.Model, exports.thisStatics, ['search','listAndCount','loadListByIds','loadList'],{MODEL_NAME});
