import config from 'config/config';
import { fetch, addStart, addCancel, formFieldChange, formSwitchToggle, addFinish,
    editStart, updateFinish, _delete } from './coreAction';

const module = 'reports';
const url=`${config.backend.url}/reports`;

export const fetchReports = () => fetch(module, url);

export const fetchSingleReports = (reportCode) => fetch(module, `${url}/${reportCode}`);

export const addReportsStart = () => addStart (module, {editing: true});

export const addReportsCancel = () => addCancel (module);

export const addReportsFinish = (data) => addFinish (module, data, url);

export const formFieldChangeReports = (field, value) => formFieldChange(module, field, value);

export const formSwitchToggleReports = (field) => formSwitchToggle(module, field);

export const editReportsStart = (id) => editStart(module, id);

export const editReportsFinish = (id, data) => updateFinish(module, data, `${url}/${id}`);

export const deleteReports = (id, code) => _delete(module, id, `${url}/${code}`);

