
import { fetch, } from './coreAction';
import config from 'config/config';

const module = 'appSettings';
const url = `${config.backend.url}/app/settings/`;


export const fetchAllAppSettings = () => fetch(module, url);
