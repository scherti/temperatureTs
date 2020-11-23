const microServiceConfiguration = {
  environment: process.env.NODE_ENV || 'local',
  healthcheck_path: process.env.HEALTHCHECK_PATH || '/health',
  healthcheck_port: process.env.HEALTHCHECK_PORT || 3000,
  healthcheck_allowed_ip: process.env.HEALTHCHECK_ALLOWED_IP || '127.0.0.1',
};

export default microServiceConfiguration;

export const CLIENT_ID = 'wee-pay-only';
// route prefix to run service under service.wee.com/wee-pay-only/*
export const ROUTE_PREFIX = '/wee-pay-only';
export const DATABASE_TYPE = 'postgres';
export const RESPONSE_TIMEOUT = 30000; // milliseconds
