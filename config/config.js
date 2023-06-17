const ENVIRONMENT_VARIABLES = {
  // Railway Devel
  railwayDatabaseUrl: process.env.DATABASE_URL,
  railwayPgDatabase: process.env.PGDATABASE,
  railwayPgHost: process.env.PGHOST,
  railwayPgPassword: process.env.PGPASSWORD,
  railwayPgPort: process.env.PGPORT,
  railwayPgUser: process.env.PGUSER,

  // Local Devel
  pgUserName: process.env.PG_USERNAME,
  pgPassword: process.env.PG_PASSWORD,
  pgDatabase: process.env.PG_DATABASE,
  pgHost: String(process.env.PG_HOST),
  pgDialect: process.env.PG_DIALECT,
};

module.exports = {
  // Railway Devel
  development:{
    username: ENVIRONMENT_VARIABLES.railwayPgUser,
    password: ENVIRONMENT_VARIABLES.railwayPgPassword,
    database: ENVIRONMENT_VARIABLES.railwayPgDatabase,
    host: ENVIRONMENT_VARIABLES.railwayPgHost,
    dialect: ENVIRONMENT_VARIABLES.pgDialect,
  },
  // Local Devel
  // development:{
  //   username: ENVIRONMENT_VARIABLES.pgUserName,
  //   password: ENVIRONMENT_VARIABLES.pgPassword,
  //   database: ENVIRONMENT_VARIABLES.pgDatabase,
  //   host: ENVIRONMENT_VARIABLES.pgHost,
  //   dialect: ENVIRONMENT_VARIABLES.pgDialect,
  // },
  staging: {
    username: "postgres",
    password: "admin",
    database: "omongin_social_web_app",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: "postgres",
    password: "admin",
    database: "omongin_social_web_app",
    host: "127.0.0.1",
    dialect: "postgres",
  },
};
