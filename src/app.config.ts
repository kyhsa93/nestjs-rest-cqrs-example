type AppConfigurationType = {
  nodeEnv: string;
  port: number;
  database: {
    type: 'mysql' | 'mariadb';
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    synchronize: boolean;
    logging: boolean;
  };
  jwt: {
    secret: string;
    expiration: number;
  };
  redis: {
    master: {
      host: string;
      port: number;
    };
    slave: {
      host: string;
      port: number;
    };
  };
  rabbitMQ: {
    exchange: string;
    hostname: string;
    userName: string;
    password: string;
  };
};

const AppConfiguration: AppConfigurationType = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  database: {
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    database: process.env.DATABASE_NAME || 'nest',
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'test',
    synchronize: process.env.DATABASE_SYNC === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
  },
  jwt: {
    secret: 'sAmPlEsEcReT',
    expiration: 3600,
  },
  redis: {
    master: {
      host: process.env.REDIS_MASTER_HOST || 'localhost',
      port: Number(process.env.REDIS_MASTER_PORT) || 6379,
    },
    slave: {
      host: process.env.REDIS_SLAVE_HOST || 'localhost',
      port: Number(process.env.REDIS_SLAVE_PORT) || 6379,
    },
  },
  rabbitMQ: {
    exchange: process.env.RABBIT_MQ_EXCHANGE || 'example-exchange',
    hostname: process.env.RABBIT_MQ_HOSTNAME || 'localhost',
    userName: process.env.RABBIT_MQ_USER_NAME || 'root',
    password: process.env.RABBIT_MQ_PASSWORD || 'test',
  },
};

export default AppConfiguration;
