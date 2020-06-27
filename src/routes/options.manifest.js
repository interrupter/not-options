module.exports = {
	model: 'options',
	url: '/api/:modelName',
	fields: require('../common/fields.js'),
	actions:{
		listAndCount:{
			method: 	'get',
			postFix: 	'/:actionName',
			data: 		['record', 'filter', 'sorter', 'search', 'pager'],
			rules:[
				{ admin: true },
				{ auth: true }
			]
		},
		get:{
			method: 'get',
			rules:[{
				auth: true,
				admin: true
			},{
				auth: true
			}],
			postFix: '/:record[_id]/:actionName'
		},
		getRaw:{
			method: 'GET',
			isArray: false,
			postFix: '/:record[_id]/:actionName',
			data: [],
			auth: true,
			admin: true
		},
		create:{
			method: 'put',
			rules:[{
				auth: true,
				admin: true
			}],
			data: ['record'],
			postFix: '/:actionName'
		},
		update:{
			method: 'post',
			rules:[{
				auth: true,
				admin: true
			},{
				auth: true,
				role: ['admin']
			},{
				auth: true
			}],
			data: ['record'],
			postFix: '/:record[_id]/:actionName'
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
		update: {
			method: 'POST',
			isArray: false,
			postFix: '/:record[_id]/update',
			data: ['record'],
			auth: true,
			admin: true,
			title: 'Редактирование опции',
			fields: {
				admin: [
					'id',
					'value',
					'active',
					'submit'
				]
			}
		},
	}
};
