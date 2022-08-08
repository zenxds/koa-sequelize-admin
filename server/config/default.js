module.exports = {
  port: 7002,

  db: {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: '3306',
    database: '',
    username: '',
    password: '',
    logging: console.log,
  },

  isProduction: false,
  staticServer: 'http://0.0.0.0:8085',
  staticVersion: '0.1.0',
}
