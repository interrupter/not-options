const initFromSchema = require('not-node').Fields.fromSchema;
const modelSchema = require('../models/options').thisSchema;

const FIELDS = initFromSchema(modelSchema, [
	'_id',
	['optionsID', {}, 'ID'],
]);

module.exports = {
	model: 'options',
	url: '/api/:modelName',
	fields: FIELDS,
	actions:{
		create:{
			method: 'put',
			rules:[{
				auth: true,
				admin: true
			}],
			data: ['record'],
			postFix: '/:actionName',
			title: 'form_title_create',
			fields: [
				'id',
				'value',
				'active'
			]
		},
		update:{
			method: 'post',
			rules:[{
				auth: true,
				admin: true
			}],
			data: ['record'],
			postFix: '/:record[_id]/:actionName',
			title: 'form_title_update',
			fields: [
				'_id',
				'optionsID',
				'id',
				'value',
				'active'
			]
		},
		listAndCount:{
			method: 	'get',
			postFix: 	'/:actionName',
			data: 		['record', 'filter', 'sorter', 'search', 'pager'],
			rules:[ { admin: true } ],
			fields: [
				'_id',
				'optionsID',
				'id',
				'value',
				'active'
			],
		},
		listAllForModule:{
			method: 	'get',
			postFix: 	'/:actionName/:record[moduleName]',
			data: 		['record', 'filter', 'sorter', 'search', 'pager'],
			rules:[ { admin: true } ],
			fields: [
				'_id',
				'optionsID',
				'id',
				'value',
				'active'
			],
		},
		updateForModule:{
			method: 	'post',
			postFix: 	'/:actionName/:record[moduleName]',
			data: 		['record', 'filter', 'sorter', 'search', 'pager'],
			rules:[ { admin: true } ],
			fields: [
				'_id',
				'optionsID',
				'id',
				'value',
				'active'
			],
		},
		get:{
			method: 'get',
			rules:[{
				auth: true,
				admin: true
			}],
			postFix: '/:record[_id]/:actionName',
			title: 'form_title_view',
			fields: [
				'_id',
				'optionsID',
				'id',
				'value',
				'active'
			]
		},
		getRaw:{
			method: 'GET',
			isArray: false,
			postFix: '/:record[_id]/:actionName',
			data: [],
			auth: true,
			admin: true
		},
		delete:{
			method: 'delete',
			rules:[{
				auth: true,
				admin: true
			}],
			data: ['record'],
			postFix: '/:record[_id]/:actionName'
		},
	}
};
