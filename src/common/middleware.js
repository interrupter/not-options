const
	notNode = require('not-node'),
	notError = require('not-error').notError;

module.exports = function(req, res, next){
	const App = notNode.Application;
	let Options = App.getModel('Options');
	if(Options){
		Options.getAllAsObject()
			.then((options)=>{
				res.options = options;
				return next();
			})
			.catch((err)=>{
				App.logger.error('Can\'t find options');
				App.report(err);
				return next();
			});
	}else{
		App.logger.error('Options model not defined');
		App.report(
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
