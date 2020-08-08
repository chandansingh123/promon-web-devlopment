import config from 'config/config';
import { fetch, clearData, addStart, addCancel, editStart, formFieldChange, addFinish, updateFinish} from './coreAction';

const module = 'reportsData';
const url=`${config.backend.url}/reports`;

export const clearReportsData = _ => clearData(module);

export const fetchReportsData = (reportCode, projectCode) => fetch(module, `${url}/${reportCode}/data?project=${projectCode}`);

export const addReportsDataStart = (reportCode, projectCode) => addStart (module, {projectCode, reportCode, editing: true});

export const addReportsDataCancel = () => addCancel (module);

export const addReportsDataFinish = (reportCode, data, projectCode) => addFinish (module, data, `${url}/${reportCode}/data?project=${projectCode}`);

export const editReportsDataStart = id => editStart (module, id);

export const editReportsDataFinish = (reportCode, id, data) => updateFinish (module, data, `${url}/${reportCode}/data/${id}`);

export const formFieldChangeReportsData = (field, value) => formFieldChange(module, field, value);
