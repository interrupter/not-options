import Validators from '../common/validators.js';
import {
	ncCRUD
} from 'not-bulma';

const LABELS = {
	plural: 'Настройки',
	single: 'Настройка',
};

class ncOptions extends ncCRUD {
	constructor(app, params) {
		super(app);
		this.setModuleName('options');
		this.setOptions('names', LABELS);
		this.setOptions('Validators', Validators);
		this.setOptions('params', params);
		this.setOptions('role', 'root');
		this.log('options interface');
		this.setOptions('list', {
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
				sortable: true
			}, {
				path: ':active',
				title: 'Активна',
				type: 'boolean',
				searchable: true,
				sortable: true
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
					}];
				},
			}]
		});
		this.start();
		return this;
	}

	createDefault() {
		let newRecord = this.make[this.getModuleName()]({
			'_id': null,
			id: LABELS.single,
			value: '',
			active: true,
		});
		return newRecord;
	}
}

export default ncOptions;
