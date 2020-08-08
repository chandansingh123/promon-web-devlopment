import config from 'config/config';
import { roleEmptyState } from 'store/store';
import { fetch, addStart, addCancel, formFieldChange, addFinish, editStart, updateFinish, _delete} from './coreAction';

const module = 'role';
const url=`${config.backend.url}/roles/`;

export const fetchRoles= () => fetch(module, url);

export const roleFormFieldChange = (field, value) => formFieldChange(module, field, value);

export const saveRole = (data) => addFinish(module, data, url);

export const addRoleStart = () => addStart (module, {...roleEmptyState, is_active:true, editing: true});

export const roleEditCancel = () => addCancel(module, roleEmptyState);

export const editRoleStart = (id) => editStart(module, id);

export const updateRole = (data) => updateFinish(module, data, `${url+data.id}/`);

export const deleteRole = (id) => _delete(module, id, `${url+id}/`);