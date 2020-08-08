
import { fetch  } from './coreAction';
import config from 'config/config';

const module = 'omkFieldValues';
const url = `${config.backend.url}/surveys/`;


// Functions related to fetching

export const fetchOmkFieldValues = (id) => fetch (module, `${url}${id}/field-values/`);
