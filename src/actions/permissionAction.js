import config from 'config/config';
import { fetch } from './coreAction';

const module = 'permission';
const url=`${config.backend.url}/permissions/`;

export const fetchPermission = () => fetch (module, url);