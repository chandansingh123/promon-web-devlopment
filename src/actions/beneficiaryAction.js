
import config from 'config/config';
import { fetch } from './coreAction';

const module = 'beneficiary';

// TODO remove this function to projectUserAction.js
export const  fetchBeneficiary = (projectCode, id) => fetch(module, `${config.backend.url}/projects/${projectCode}/user-details/${id}`);
