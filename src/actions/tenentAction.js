import config from '../config/config';
import { fetch, addStart, addCancel, formFieldChange, addFinish, editStart, updateFinish, _delete} from './coreAction';
import { tenantEmptyState } from 'store/store';

const module = 'tenant';
const url=`${config.backend.url}/tenant/`;

export const fetchCountries = () => fetch(module,url);

export const tenentFormFieldChange = (field, value) => formFieldChange(module, field, value);

export const saveTenant = (data) =>  addFinish(module, data, url, tenantEmptyState);

export const addTenantStart = () => addStart (module, {...tenantEmptyState, editing: true});

export const tenantEditCancel = () => addCancel(module, tenantEmptyState);

export const editTenentStart = (id) => editStart(module, id);

export const updateTenent = (data) => updateFinish(module, data, `${url+data.id}/`, tenantEmptyState);

export const deleteTenant = (id) => _delete(module, id, `${url+id}/`);