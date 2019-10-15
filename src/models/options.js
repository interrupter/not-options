try {
	const MODEL_NAME = 'Options';
	const Schema = require('mongoose').Schema;
	const metaExtend = require('not-meta').extend;
	const metaModel = require('not-meta').Model;
	const ActionList = [
		'search'
	];
	exports.keepNotExtended = false;
	exports.thisModelName = MODEL_NAME;
	exports.enrich = {
		versioning: true,
		increment: false,
		validators: true
	};
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

	exports.thisStatics = {
		getAllAsObject() {
			return this.find({
				'active': true
			}).exec()
				.then((results) => {
					let options = {};
					if (Array.isArray(results)) {
						results.forEach((item) => {
							options[item.id] = item.value;
						});
					}
					return options;
				});
		}
	};

	metaExtend(metaModel, exports.thisStatics, ActionList, {
		MODEL_NAME
	});
} catch (e) {
	//eslint-disable-next-line no-console
	console.error(e);
}
