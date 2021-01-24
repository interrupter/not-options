const Schema = require('mongoose').Schema;

module.exports = {
	model:  {
		type: Schema.Types.Mixed,
		searchable: true,
		required: true
	},
	ui:     {
		component:    'UITextarea',
		placeholder:  'Настройки',
		label:        'Значение',
		readonly:     false
	},
};
