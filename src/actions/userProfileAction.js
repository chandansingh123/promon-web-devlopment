
import { formFieldChange, updateFinish } from './coreAction';
import config from 'config/config';

const module = 'userProfile';

export const loadUserProfile = (data) => ({type: 'LOAD_USER_PROFILE', module, data});

export const formFieldChangeUserProfile = (field, value) => formFieldChange (module, field, value);

export const updateFinishUserProfile = (data) => updateFinish (module, data, `${config.backend.url}/user/profile`, data);

export const updateFinishUserProfilePassword = (data) => updateFinish (module, data, `${config.backend.url}/user/password`, data);
