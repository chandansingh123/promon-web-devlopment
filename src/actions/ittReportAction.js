
import { fetch, addStart, addCancel, formFieldChange, addFinish, formSwitchToggle } from './coreAction';
import config from 'config/config';

const module = 'ittReports';

export const fetchIttReport = (projectCode) => fetch(module, `${config.backend.url}/reports/${projectCode}/itt`);

export const addIttReportStart = (level, parent) => addStart(module, {level, parent, editing: true});

export const addIttReportCancel = () => addCancel(module);

export const addIttReportFinish = (data) => addFinish(module, data, `${config.backend.url}/reports/tupche/itt`);

export const onChangeIttReport = (field, value) => formFieldChange(module, field, value);

export const onToggleIttReport = (field) => formSwitchToggle(module, field);
