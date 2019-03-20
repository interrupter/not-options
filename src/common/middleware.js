const App = require('not-node').Application;
const notError = require('not-error').notError;

module.exports = function(req, res, next){
	let Options = App.getModel('Options');
	if(Options){
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
	}else{
		App.logger.error('Options model not defined');
		App.reporter.report(
			new notError(
				'Model not defined',
				{
					name: 'Options'
				}
			)
		);
		return next();
	}
};
