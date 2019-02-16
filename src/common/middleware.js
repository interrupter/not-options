const App = require('not-node').Application;

module.exports = function(req, res, next){
	let Options = App.getModel('Options');
	Options.getAllAsObject()
		.then((options)=>{
			res.options = options;
			return next();
		})
		.catch((err)=>{
			App.logger.error('Can\'t find options');
			App.reporter.report(err);
			return next();
		});
};
