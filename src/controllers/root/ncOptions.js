/* global notFramework */

class ncOptions extends notFramework.CRUDController {
	constructor(app, params) {
		super(app);
		this.setModuleName('options');
		this.setOptions('names', {
			plural: 'Options',
			single: 'Option',
		});
		this.setOptions('params', params);
		this.setOptions('role', 'admin');
		this.setOptions('containerSelector', this.app.getOptions('crud.containerSelector'));
		this.log('options interface');
		let formHelpers = {};
		this.setOptions('views', {
			default:{
				renderFromURL: false,
				common: false,
				prefix: 'gallery-',
				postfix: '',
			},
			create: {
				preload: {},
				action: 'create',
				renderFromURL: false,
				name:'gallery-edit',
				prefix: 'form-',
				targetQuery: '#form-place',
				helpers: formHelpers
			},
			update: {
				preload: {},
				action: 'update',
				renderFromURL: false,
				name:'gallery-edit',
				prefix: 'form-',
				targetQuery: '#form-place',
				helpers: formHelpers
			},
			list: {
				interface:	{
					combined:	true
				},
				helpers:{
					createURL: [this.getModelURL(),'create'].join('/')
				},
				targetQuery: '#table-place',
				prefix: 'gallery-',
				postfix: '',
				endless: false,
				renderFromURL: false,
				name: 'list',
				common: false,
				preload: {},
				fields: [{
					path: ':id',
					title: 'ID',
					searchable: true,
					sortable: true
				}, {
					path: ':value',
					title: 'Value',
					sortable: true,
					searchable: true
				}, {
					path: ':_id',
					title: 'Действия',
					preprocessor: (value) => {
						return {
							links:[
								{
									url: [this.getModelURL(), value, 'update'].join('/'),
									title: 'Изменить'
								},
								{
									url: [this.getModelURL(), value, 'delete'].join('/'),
									title: 'Удалить'
								}
							]
						};
					},
					component: {
						template: {
							name: 'links'
						}
					}
				}]
			}
		});
		this.route(params);
		return this;
	}
	initItem() {
		let newRecord = this.make[this.getModuleName()]({
			'_id': null,
			id: this.getOptions('names.single'),
			value: '',
			active: true
		});
		return newRecord;
	}
}

export default ncOptions;
