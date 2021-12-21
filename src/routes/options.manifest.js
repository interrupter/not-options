const FIELDS = [
	'_id',
	['optionsID', {}, 'ID'],
];

module.exports = {
	model: 'options',
	url: '/api/:modelName',
	fields: FIELDS,
	actions:{
		export:{
			method: 'get',
			postFix: '/:actionName',
			title: 'form_title_export',
			rules: [{ root:true }]
		},
		import:{
			method: 'put',
			data: ['record'],
			postFix: '/:actionName',
			title: 'form_title_import',
			rules: [{ root:true }]
		},
		create:{
			method: 'put',
			rules:[{
				auth: true,
				root:true
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
				root:true
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
			rules:[ { root:true } ],
			fields: [
				'_id',
				'optionsID',
				'id',
				'value',
				'active'
			],
		},
		getForModule:{
			method: 	'get',
			postFix: 	'/:actionName/:record[moduleName]',
			data: 		['record', 'filter', 'sorter', 'search', 'pager'],
			rules:		[ { root:true } ]
		},
		updateForModule:{
			method: 	'post',
			postFix: 	'/:actionName/:record[moduleName]',
			data: 		['record', 'filter', 'sorter', 'search', 'pager'],
			rules:		[ { root:true } ]
		},
		get:{
			method: 'get',
			rules:[{
				auth: true,
				root:true
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
			rules:[{
				auth: true,
				root:true
			}],
		},
		delete:{
			method: 'delete',
			rules:[{
				auth: true,
				root:true
			}],
			data: ['record'],
			postFix: '/:record[_id]/:actionName'
		},
	}
};
