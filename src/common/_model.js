const App = require('not-node').Application;

exports.get_listAndCount = (input)=>{
	return (req)=>{
		let list = App.getModel(input.MODEL_NAME).list(req.pager.skip, req.pager.size, req.sorter, req.search || req.filter),
			count = App.getModel(input.MODEL_NAME).countWithFilter(req.search || req.filter);
		return Promise.all([list, count]);
	};
};

exports.get_loadListByIds = (input)=>{
	return (list = [], filter = {})=>{
		return App.getModel(input.MODEL_NAME).find({'id': Object.assign({$in:list}, filter)}).exec();
	};
};

exports.get_loadList = (input)=>{
	return (list = [], filter = {})=>{
		return App.getModel(input.MODEL_NAME).find({'_id': Object.assign({$in:list},filter)}).exec();
	};
};

exports.get_search = (input)=>{
	return (searchQuery) => {
		let model = App.getModel(input.MODEL_NAME);
		return Promise.all([input.MODEL_NAME, model.makeQuery('find', searchQuery).exec()]);
	};
};


exports.get_getAllAsObject = (input)=>{
	return () => {
		let model = App.getModel(input.MODEL_NAME);
		return App.getModel(input.MODEL_NAME).find({'active': true}).exec()
			.then((results) => {
				let options = {};
				if(Array.isArray(results)){
					results.forEach((item) => {
						options[item.id] = item.value;
					});
				}
				return options;
			});
	};
};
