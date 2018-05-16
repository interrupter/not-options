const NAME_PREFIX = 'get_';
exports.Route = require('./_route.js');
exports.Model = require('./_model.js');

/**
*   Массированная инициализация общих функций
*   @param  {object}    src     источник
*   @param  {object}    dest    назначение
*   @param  {array}     list    список для переноса
*   @param  {object}    params  объект с параметрами для инициализации
*/
exports.extend = (src, dest, list, params)=>{
	if(src && dest && Array.isArray(list)){
		for(let name of list){
			let fac = src[NAME_PREFIX+name];
			if(typeof fac!=='undefined' && fac!==null){
				dest[name] = fac(params);
			}
		}
	}	
};
