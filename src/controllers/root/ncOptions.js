import Validators from '../common/validators.js';
import {
	ncCRUD
} from 'not-bulma';

import UIImport from '../common/import.svelte';

const LABELS = {
	plural: 'Настройки',
	single: 'Настройка',
};

const MODEL = 'options';

class ncOptions extends ncCRUD {
	static MODEL_NAME = MODEL;
	static MODULE_NAME = '';
	constructor(app, params, schemes) {
		super(app, MODEL);
		this.setModuleName('');
		this.setModelName(MODEL);
		this.setOptions('names', LABELS);
		this.setOptions('Validators', Validators);
		this.setOptions('params', params);
		this.setOptions('role', 'root');
		this.setOptions('urlSchemes', schemes);
		this.setOptions('list', {
			actions: [{
					title: 'Экспорт',
					action: this.openExport.bind(this)
				},
				{
					title: 'Импорт',
					action: this.openImport.bind(this)
				}
			],
			fields: [{
				path: ':optionsID',
				title: 'ID',
				searchable: true,
				sortable: true
			}, {
				path: ':id',
				title: 'Название',
				searchable: true,
				sortable: true
			}, {
				path: ':value',
				title: 'Значение',
				searchable: true,
				sortable: true,
				hideOnMobile: true
			}, {
				path: ':active',
				title: 'Активна',
				type: 'boolean',
				searchable: true,
				sortable: true,
				preprocessor: (value) => {
					return [{
						value
					}];
				},
				hideOnMobile: true
			}, {
				path: ':_id',
				title: 'Действия',
				type: 'button',
				preprocessor: (value) => {
					return [{
							action: this.goDetails.bind(this, value),
							title: 'Подробнее',
							size: 'small'
						},
						{
							action: this.goUpdate.bind(this, value),
							title: 'Изменить',
							size: 'small'
						},
						{
							action: this.goDelete.bind(this, value),
							type: 'danger',
							title: 'Удалить',
							size: 'small',
							style: 'outlined'
						}
					];
				},
			}]
		});
		this.start();
		return this;
	}

	createDefault() {
		let newRecord = this.make[this.getModelName()]({
			'_id': null,
			id: LABELS.single,
			value: '',
			active: true,
		});
		return newRecord;
	}

	openExport() {
		window.location.assign('/api/options/export');
		/*this.make[this.getModelName()]({}).$export()
			.then((data)=>{
				this.log(data);
			})
			.catch(e => this.error(e));*/
	}

	closeImportPopup() {
		if (this.ui.import) {
			this.ui.import.$destroy();
			this.ui.import = null;
		}
	}

	openImport() {
		this.log('import');
		this.closeImportPopup();
		this.ui.import = new UIImport({
			target: document.body
		});
		this.ui.import.$on('reject', (ev) => {
			if (ev.detail.error) {
				this.error(ev.detail.error);
			}
			this.closeImportPopup();
		});
		this.ui.import.$on('resolve', () => this.closeImportPopup());
		this.ui.import.$on('import', async (ev) => {
			if (ev.detail.options) {
				try {
					let res = await this.requestImport(ev.detail.options);
					this.log(res);
					if (res.status === 'ok') {
						if (res.result && res.result.info) {
							this.ui.import.setInfo(res.result.info);
							this.afterImportSuccess(res.result);
						}
					} else {
						this.error(res.error);
						this.ui.import.setError(res.error);
					}
				} catch (e) {
					this.ui.import.setError(e.message);
					this.error(e);
				}
			}
		});
	}

	afterImportSuccess(result) {
		let delay = parseInt(result.shutdown) + 2000;
		this.refresh(delay);
		setTimeout(() => this.closeImportPopup(), delay);
	}

	requestImport(data) {
		return this.make[this.getModelName()]({
			options: data
		}).$import();
	}

	getItemTitle(item) {
		return `${item.optionsID}#${item.id}`;
	}

}

export default ncOptions;
