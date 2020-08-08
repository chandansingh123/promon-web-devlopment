
import config from 'config/config';
import { fetch, addStart, addCancel, formFieldChange, addFinish, editStart, updateFinish, _delete, formSwitchToggle} from './coreAction';
import { userEmptyState } from 'store/store';


const module = 'users';
const url=`${config.backend.url}/users/`;

export const fetchUsers = _=> fetch(module,url);

export const userFormFieldChange = (field, value) => formFieldChange(module, field, value);

export const userFormToggleSwitch = field => formSwitchToggle(module, field);

export const addUserStart = _ => addStart (module, {...userEmptyState, editing: true});

export const userEditCancel = _ => addCancel(module);

export const editUserStart = id => editStart(module, id);

export const saveUser = data => addFinish(module, data, url, userEmptyState);

export const updateUser = data => updateFinish(module, data, `${url}${data.id}/`);

export const deleteUser = id => _delete(module, id, `${url}${id}/`);
