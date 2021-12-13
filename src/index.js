import { RestInterface } from './interfaces';
import config from './config/config.dev';
import { AnalyticsRelay } from './utils';

new RestInterface(config, new AnalyticsRelay());
