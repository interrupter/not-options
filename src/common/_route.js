const log = require('not-log')(module),
	query = require('not-filter'),
	mongoose = require('mongoose'),
	Auth = require('not-node').Auth,
	App = require('not-node').Application;

exports.extractString = (variants, locales)=>{
	if (typeof variants !== 'undefined' && variants !== null && Object.keys(variants).length && variants.constructor !== String){
		for(let lang of locales){
			if (variants.hasOwnProperty(lang)){
				return variants[lang];
			}
		}
		let langs = Object.keys(variants);
		if (langs.length){
			return variants[langs[0]];
		}else{
			return 'none';
		}
	}else{
		return variants;
	}
};

exports.getProperty = (list, name, field = 'id')=>{
	for (let item of list){
		if (item[field].toString() == name){
			return item;
		}
	}
	return false;
};

exports.toPlainObject = (data, extract = false)=>{
	for(let i in data){
		if (data[i] && data[i].toObject){
			data[i] = data[i].toObject();
		}
	}
	return data;
};

/**
*	Обрабатывает результаты запроса поиска, фильтрации, сортировки
*	выкидывает лишние данные, запрашивает дополнительные
*	@param {array} массив результатов из двух элементов;
*					0 - записи,
*					1 - общее число
*	@return {Promise} объект с полями (list, count)
*/
exports.processRawListAndCount = (results, modelName)=>{
	return new Promise(async(resolve, reject)=>{
		try{
			let [list, count] = results;
			//упрощаем из документа до объекта
			list = exports.toPlainObject(list);
			resolve({
				list,
				count
			});
		}catch(e){
			reject(e);
		}
	});
};

exports.processRawList = (results, modelName)=>{
	return new Promise(async(resolve, reject)=>{
		try{
			//упрощаем из документа до объекта
			results = exports.toPlainObject(results);
			resolve(results);
		}catch(e){
			reject(e);
		}
	});
};


/**
*	Запрос списка объектов и общего числа
*	@param {ExpressRequest} req
*	@param {ExpressResponse} res
*
*/
exports.get_listAndCount = function (input){
	return async(req, res)=>{
		let thisModel = App.getModel(input.MODEL_NAME),
			thisSchema = App.getModelSchema(input.MODEL_NAME);
		thisModel.listAndCount(req)
			.then((result)=>{return exports.processRawListAndCount(result, input.MODEL_NAME);})
			.then((result)=>{
				result.pages = Math.ceil(result.count / req.pager.size);
				query.return.process(req, thisSchema, result.list);
				res.status(200).json(result);
			})
			.catch((err)=>{
				log.error(err);
			});
	};
};

exports.get_list = function (input){
	return (req, res)=>{
		log.info('list ',input.MODEL_NAME);
		let thisModel = App.getModel(input.MODEL_NAME),
			thisSchema = App.getModelSchema(input.MODEL_NAME);
		thisModel.list(req)
			.then(exports.toPlainObject)
			.then((data)=>{
				query.return.process(req, thisSchema, data);
				res.status(200).json(data);
			})
			.catch((err)=>{
				log.error(err);
				res.status(500).json({});
			});
	};
};

exports.getOwner = (req)=>{
	let owner = {};
	if(req.user && req.user._id && req.user.constructor.modelName){
		owner.kind = req.user.constructor.modelName;
		owner.item = req.user._id;
	}else{
		owner.session = req.session.id;
	}
	return owner;
};

exports.get_getOne = function(input){
	return (req, res)=>{
		let id = req.params._id,
			thisModel = App.getModel(input.MODEL_NAME);
		thisModel.getOne(id)
			.then((items)=>{
				return this.enrichOne(items, input.MODEL_NAME);
			})
			.then((item) => {
				res.status(200).json(item);
			})
			.catch((e) => {
				res.status(500).json(e);
				log.error(e);
			});
	};
};

exports.get_getRaw = function(input){
	return (req, res) =>{
		let id = req.params._id,
			thisModel = App.getModel(input.MODEL_NAME);
		thisModel.getOneRaw(id)
			.then((item) => {
				res.status(200).json(item);
			})
			.catch((e) => {
				res.status(500).json(e);
				log.error(e);
			});
	};
};

exports.get_update = function(input){
	return (req, res)=>{
		let id = req.params._id,
			thisModel = this.getModel(input.MODEL_NAME);
		delete req.body._id;
		thisModel.findOneAndUpdate({
			_id: id,
		}, req.body)
			.then(item => {
				res.status(200).json(item);
			})
			.catch((err)=>{
				log.error(err);
				res.status(500).json({});
			});
	};
};
