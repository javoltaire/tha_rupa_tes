import { RestInterface } from './interfaces';
import config from './config/config.dev';

const restInterface = new RestInterface(config);
console.log(restInterface)