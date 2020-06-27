import validator from 'validator';

export default class Common{

	static DEFAULT_USER_AFTER_LOGIN_URL = '/dashboard';
	static DEFAULT_REDIRECT_TIMEOUT = 5000;

	static CLASS_OK = 'is-success';
	static CLASS_ERR = 'is-danger';

  static goDashboard(app) {
    document.location.assign(this.getUserAfterLoginRedirectURL(app));
  }

  static isError(e){
    return e instanceof Error;
  }
	
  static validateField(field, value, fields){
		let errors = [];
		switch(field){
			case 'id':
			 if (!validator.isLength(value, { min: 3})){
					errors.push('Минимальная длина 3 знаков');
			 }
			break;
			case 'active':
				if((value !== false) && (value !== true)){
					errors.push('Необходимо ввести действительное значение автивности записи');
				}
			break;
			case 'value':
				if (!validator.isLength(value, { min: 0, max: 10240})){
					errors.push('Максимальный размер данных 10240 знаков');
				}
			break;
			default: return false;
		}
		let res = errors.length > 0 ? errors:true;
		fields[field].validated = true;
		fields[field].valid = res === true;
		fields=fields;
		return res;
	}
	static FIELDS = {
		id:{
			label: 'Название',
			placeholder: 'Идентификатор настройки',
		},
		active:{
			label: 'Активна',
			placeholder: '',
		},
		value:{
			label: 'Значение',
			placeholder: 'До 10240 знаков',
		}
	}
	static fieldInit(type, mutation = {}){
		let field = {
			label: '',
			placeholder: '',
			enabled: true,
			value: '',
			required: true,
			validated: false,
			valid: false
		};
		if(Object.prototype.hasOwnProperty.call(this.FIELDS, type)){
			Object.assign(field, this.FIELDS[type]);
		}
		if(mutation){
			Object.assign(field, mutation);
		}
		return field;
	}
};
