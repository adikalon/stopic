module.exports = {
  type: 'postgres',
  port: 5432,
  host: 'postgres',
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_BASENAME,
  synchronize: true,
};
