const log = require('not-log')(module, 'Options Model');
try {
	const MODEL_NAME = 'Options';
	const initFields = require('not-node').Fields.initFields;
	const notError = require('not-error').notError;

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
	const MODULE_OPTIONS_PREFIX = 'MODULE_';

	exports.thisStatics = {
		getModuleOptionsName(moduleName){
			return MODULE_OPTIONS_PREFIX + moduleName.toLowerCase();
		},
		readModuleOptions(moduleName){
			let name = this.getModuleOptionsName(moduleName);
			return this.findOne({
				'id': 		name,
				'active': true,
				__latest: true,
				__closed: false
			}).exec()
				.then((result) => {
				if (result) {
					try{
						return JSON.parse(result.value);
					}catch(e){
						log.error(e);
						return {};
					}
				}else{
					return {};
				}
			});
		},
		async writeModuleOptions(moduleName, options){
			let name = this.getModuleOptionsName(moduleName);
			let value = JSON.stringify(options);
			let exists = await this.countWithFilter({
				id: name,
				__latest: true,
				__closed: false
			});
			if(exists){
				await this.updateOne({
						id: name,
						__latest: true,
						__closed: false
					},
					{
						value,
					}
				).exec();
				let item = await this.findOne({id: name,__latest: true,__closed: false}).exec();
				if (typeof item !== 'undefined' && item !== null) {
					return this.saveVersion(item._id);
				} else {
					throw new notError('-options for module version not saved, empty response', {
						id: name,
						item
					});
				}
			}else{
				this.add({
					id: name,
					value,
					active: true
				});
			}
		},
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
		},
		async initIfNotExists(opts){
			let names = Object.keys(opts);
			let res = await this.find({ __closed: false, __latest: true, id: {$in: names}}).exec();
			let existed = res.map(itm=>itm.id);
			for(let name of names){
				if (!existed.includes(name)){
					await this.add({
						id: name,
						...opts[name]
					});
				}
			}
		}
	};

	metaExtend(metaModel, exports.thisStatics, ActionList, {
		MODEL_NAME
	});

} catch (e) {
	log.error(e);
}
