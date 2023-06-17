const pgUserName = process.env.PG_USERNAME
const pgPassword = process.env.PG_PASSWORD
const pgDatabase = process.env.PG_DATABASE
const pgHost = String(process.env.PG_HOST)
const pgDialect = process.env.PG_DIALECT

module.exports = {
  development: {
    username: pgUserName,
    password: pgPassword,
    database: pgDatabase,
    host: pgHost,
    dialect: pgDialect,
  },
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
