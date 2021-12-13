import { RestInterface } from './interfaces';
import config from './config/config.dev';
import { AnalyticsRelay } from './utils';

const addEnvVarsToConfig = config => ({ 
    ...config, 
    sendGrid: { key: process.env.SG_API_KEY },
    mailGun: { key: process.env.MG_API_KEY },
});

new RestInterface(addEnvVarsToConfig(config), new AnalyticsRelay());