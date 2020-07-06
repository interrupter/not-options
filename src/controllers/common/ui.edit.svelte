<script>
	import 'bulma-switch';

	import {onMount} from 'svelte';
	import Common from './index.js';

	const CLASS_ERR = Common.CLASS_ERR;
	const CLASS_OK = Common.CLASS_OK;

	let overlay;
	let stage = 'filling';
	let errorMessage = false;
	let formErrors = false;
	let success = false;

	let validationErrors = {
    active:        	false,
		value:       	false,
		id: 					false
	};

	export let validation = true;
	export const  MODES = ['create', 'update'];

	export const  MODES_FIELDS = {
		'create': ['id', 'value', 'active'],
		'update': ['id', 'value', 'active'],
	};

	export const SUCCESS_TEXT = {
		'create': 'Настройка создана',
		'update': 'Настройка обновлёна'
	};

	import {createEventDispatcher} from 'svelte';
	let dispatch = createEventDispatcher();

	export let mode = 'create';
	export let loading = false;
	export let formValid = false;

	export let title = {
		__enabled: true,
		create: 'Добавление настройки',
		update: 'Редактирование настройки',
	};

	export let description = {
		__enabled: true,
		create:  'Заполните пожалуйств форму',
		update:  'Заполните пожалуйств форму',
	};

	export let value = Common.fieldInit('value', {enabled: true});
	export let id = Common.fieldInit('id', {enabled: true});
	export let active = Common.fieldInit('active', {enabled: true});

	let fields = {id, value, active};

	export let submit = {
		caption: 'Отправить',
		enabled: true
	};

	export let cancel = {
		caption: 'Назад',
		enabled: true
	};

	export let item = {};



	onMount(() => {
		for(let t in item){
			if(Object.prototype.hasOwnProperty.call(fields, t)){
				fields[t].value = item[t];
			}
		}
		for(let t in fields){
			if (MODES_FIELDS[mode].indexOf(t) === -1){
				fields[t].enabled = false;
			}
		}
		fields = fields;
	});

	function collectData(){
		let result = {};
		MODES_FIELDS[mode].forEach((fieldname)=>{
			if(Object.prototype.hasOwnProperty.call(fields, fieldname) && fields[fieldname].enabled){
				result[fieldname]	 = fields[fieldname].value;
			}
		});
		if (mode === 'update'){
			result._id = item._id;
		}
		return result;
	}

	function onChange(ev){
		let data = {
			field: ev.target.name,
			value: ev.target.type==='checkbox'?ev.target.checked:ev.target.value
		};
		if(validation){
			let res = Common.validateField(data.field, data.value, fields);
			if(res === true){
				setFieldValid(data.field);
			}else{
				setFieldInvalid(data.field, res);
			}
			validateForm(data);
		}else{
			dispatch('change', data);
		}
	}

	export function setFieldInvalid(fieldName, errors){
		validationErrors[fieldName] = errors;
		validationErrors = validationErrors
		formErrors = true;
	}

	export function setFieldValid(fieldName){
		validationErrors[fieldName] = false;
		formErrors = Object.values(validationErrors).some((val) => {return val;});
	}

	export function fieldIsValid(fieldName){
		return !Array.isArray(validationErrors[fieldName]);
	}

	export function fieldErrorsNotChanged(fieldName, errs){
		let oldErrs = validationErrors[fieldName];
		if(oldErrs === false && errs === false){
			return true;
		}else{
			if(Array.isArray(oldErrs) && Array.isArray(errs)){
				return (oldErrs.join('. ')) === (errs.join('. '));
			}else{
				return false;
			}
		}
	}

	function onInput(ev){
		let data = {
			field: ev.target.name,
			input: ev.data,
			value: ev.target.type==='checkbox'?ev.target.checked:ev.target.value
		};
		if(validation){
			let res = Common.validateField(data.field, data.value, fields);
			if(res === true){
				setFieldValid(data.field);
			}else{
				setFieldInvalid(data.field, res);
			}
			validateForm(data);
		}else{
			dispatch('input', data);
		}
	}

	function validateForm(freshData){
		if(MODES.indexOf(mode) > -1){
			let fieldsList = MODES_FIELDS[mode];
			let result = true;
			fieldsList.forEach((fieldName) => {
				if (fields[fieldName].enabled && fields[fieldName].required){
					let val = (freshData && (freshData.field === fieldName))?freshData.value:fields[fieldName].value;
					let errs = Common.validateField(fieldName, val, fields);
					if (Array.isArray(errs)){
						result = false;
					}
					if(!fieldErrorsNotChanged(fieldName, errs)){
						if(Array.isArray(errs)){
							setFieldInvalid(fieldName, errs);
						}else{
							setFieldValid(fieldName);
						}
					}
				}
			});
			formValid = result;
			return result;
		}else{
			formValid = false;
			return false;
		}
	}

	export function setFormError(error){
		formValid = false;
		errorMessage = Array.isArray(error)?error.join(', '):error;
	}

	export let tryModeAction = (e)=>{
		e && e.preventDefault();
		errorMessage = false;
		dispatch(mode, collectData());
		return false;
	};

	export function showSuccess(){
		success = true;
	}

	export let rejectForm = ()=>{
		loading = true;
		dispatch('rejectForm');
	}

	export function setLoading(){
		loading = true;
	}

	export function resetLoading(){
		loading = false;
	}
	$: idHelper = validationErrors.id?validationErrors.id.join(', '):fields.id.placeholder;
	$: idClasses = validationErrors.id?CLASS_ERR:CLASS_OK;

	$: valueHelper = validationErrors.value?validationErrors.value.join(', '):fields.value.placeholder;
	$: valueClasses = validationErrors.value?CLASS_ERR:CLASS_OK;

	$: activeHelper = validationErrors.active?validationErrors.active.join(', '):active.placeholder;
	$: activeClasses = validationErrors.active?CLASS_ERR:CLASS_OK;

	$: formInvalid = (formValid === false);

</script>

{#if success}
<div class="notification is-success">
	<h3 class="user-form-success-message">{SUCCESS_TEXT[mode]}</h3>
</div>
{:else}
{#if title.__enabled}
<h5 class="title">{title[mode]} {#if mode==='update'}{item.id}{/if}</h5>
{/if}
{#if description.__enabled}
<h6 class="subtitle is-6">{description[mode]}</h6>
{/if}
<div class="container">
	{#if fields.id.enabled}
	<div class="field edit-form-field edit-form-id">
		<label class="label">{fields.id.label}</label>
		<div class="control has-icons-right">
			<input class="input {idClasses}" type="text" name="id"
				invalid="{validationErrors.id}" required={fields.id.required}
				placeholder="{fields.id.placeholder}"
				bind:value={fields.id.value} on:change={onChange}
				on:input={onInput} autocomplete="id"
				aria-controls="input-field-helper-id" aria-describedby="input-field-helper-id" />
			{#if fields.id.validated === true }
			<span class="icon is-small is-right">
				{#if fields.id.valid}
				<i class="fas fa-check"></i>
				{:else}
				<i class="fas fa-exclamation-triangle"></i>
				{/if}
			</span>
			{/if}
		</div>
		<p class="help {idClasses}" id="input-field-helper-id">
			{#if !(fields.id.validated && fields.id.valid) }{idHelper}{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	{#if fields.value.enabled}
	<div class="edit-form-field edit-form-value field">
		<label class="label">{fields.value.label}</label>
		<div class="control has-icons-right">
			<textarea invalid="{validationErrors.value}" on:change={onChange} on:input={onInput}
			class="textarea {valueClasses}"
			required={fields.value.required}
			bind:value={fields.value.value}
			name="value"
			placeholder="{fields.value.placeholder}" rows="10"
			aria-controls="input-field-helper-value" aria-describedby="input-field-helper-value"
			></textarea>
			{#if fields.value.validated === true }
			<span class="icon is-small is-right">
					{#if fields.value.valid}
					<i class="fas fa-check"></i>
					{:else}
					<i class="fas fa-exclamation-triangle"></i>
					{/if}
			</span>
			{/if}
		</div>

		<p class="help {valueClasses}" id="input-field-helper-value">
			{#if !(fields.value.validated && fields.value.valid) }
			{valueHelper}
			{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	{#if fields.active.enabled}
	<div class="edit-form-field edit-form-active field">
			<input
				id="edit-form-active-field"
				class="switch is-rounded is-success "
				bind:checked={fields.active.value}
				required={fields.active.required}
				placeholder="{fields.active.placeholder}"
				invalid="{validationErrors.active}" on:change={onChange} on:input={onInput}
				name="active" type="checkbox"
				aria-controls="input-field-helper-active" aria-describedby="input-field-helper-active"
				/>
		<label class="label" for="edit-form-active-field">{fields.active.label}</label>
		<p class="help {activeClasses}" id="input-field-helper-active">
			{#if !(fields.active.validated && fields.active.valid) }
			{activeHelper}
			{:else}&nbsp;{/if}
		</p>
	</div>
	{/if}

	<div class="buttons-row">
		{#if cancel.enabled}
		<button class="button is-outlined edit-form-cancel" on:click={rejectForm}>{cancel.caption}</button>
		{/if}
		{#if submit.enabled}
		<button on:click={tryModeAction} disabled={formInvalid} class="button is-primary is-hovered edit-form-submit pull-right">{submit.caption}</button>
		{/if}
	</div>

</div>
{/if}
