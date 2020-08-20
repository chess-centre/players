const dbSettings = {
  db: process.env.DB || 'players',
  user: process.env.DB_USER || 'user',
  pass: process.env.DB_PASS || 'password',
  servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(' ') : []
}

const serverSettings = {
  port: process.env.PORT || 3000
}

module.exports = Object.assign({}, { dbSettings, serverSettings })
