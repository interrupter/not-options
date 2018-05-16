module.exports = {
	model: 'options',
	url: '/api/:modelName',
	fields: require('../common/fields.js'),
	actions:{
		listAndCount:{
			method: 'get',
			postFix: '/:actionName',
			data: ['record', 'filter', 'sorter', 'search', 'pager'],
			rules:[
				{auth: false},
				{admin: true}
			]
		},
		get:{
			method: 'GET',
			isArray: false,
			postFix: '/:record[_id]',
			data: [],
			auth: false,
			admin: false
		},
		getRaw:{
			method: 'GET',
			isArray: false,
			postFix: '/:record[_id]/:actionName',
			data: [],
			auth: true,
			admin: true
		},
		create: {
			method: 'PUT',
			isArray: false,
			data: ['record'],
			auth: true,
			admin: true,
			formData: true,
			title: 'Создание опции',
			fields: {
				admin: [
					'id',
					'title',
					'value',
					'active',
					'submit'
				]
			}
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
					'title',
					'value',
					'active',
					'submit'
				]
			}
		},
	}
};
