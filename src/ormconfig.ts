import { ConnectionOptions } from 'typeorm';
import { DATABASE_TYPE } from './configuration';
import TemperatureLog from './entity/TemperatureLog';

const config: ConnectionOptions = {
  type: DATABASE_TYPE,
  host: process.env.TYPEORM_HOST,
  port: Number(process.env.TYPEORM_PORT),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  // synchronize: Boolean(process.env.TYPEORM_SYNCHRONIZE),
  logging: Boolean(process.env.TYPEORM_LOGGING),
  migrationsRun: true,
  entities: [TemperatureLog],
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
  synchronize: true,
};

export = config;
