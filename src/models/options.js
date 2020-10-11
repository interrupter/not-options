const log = require('not-log')(module, 'Options Model');
try {
	const MODEL_NAME = 'Options';
	const initFields = require('not-node').Fields.initFields;

	const FIELDS = [
		'id',
		'value',
		[
			'active',
			{
				default: true
			}
		]
	];

	exports.keepNotExtended = false;
	exports.thisModelName = MODEL_NAME;
	exports.thisSchema = initFields(FIELDS, 'model');

	exports.enrich = {
		versioning: true,
		increment: true,
		validators: true
	};

	const metaExtend = require('not-meta').extend;
	const metaModel = require('not-meta').Model;

	const ActionList = ['search'];

	exports.thisStatics = {
		getAllAsObject(whitelist = false) {
			return this.find({
				'active': true,
				__latest: true,
				__closed: false
			}).exec()
				.then((results) => {
					let options = {};
					if (Array.isArray(results)) {
						results.forEach((item) => {
							if(whitelist && Array.isArray(whitelist)){
								if(!whitelist.includes(item.id)){return;}
							}
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
	log.error(e);
}
