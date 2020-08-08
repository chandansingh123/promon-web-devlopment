
import config from 'config/config';
import { fetch } from './coreAction';

const module = 'projectsSummary';
const url=`${config.backend.url}/projects/location-summary/`;

export const  fetchProjectsSummary = () => fetch(module, url);

