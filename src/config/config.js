const dbSettings = {
    db: process.env.DB || 'players',
    user: process.env.DB_USER || 'user',
    pass: process.env.DB_PASS || 'password',
    servers: (process.env.DB_SERVERS) ? process.env.DB_SERVERS.split(' ') : [
        'localhost:27017',
    ],
    dbParameters: () => ({
        w: 'majority',
        wtimeout: 10000,
        j: true,
        readPreference: 'ReadPreference.SECONDARY_PREFERRED',
        native_parser: false
    }),
    serverParameters: () => ({
        autoReconnect: true,
        poolSize: 10,
        socketoptions: {
            keepAlive: 300,
            connectTimeoutMS: 30000,
            socketTimeoutMS: 30000
        }
    })
}

const serverSettings = {
    port: process.env.PORT || 3000
}

module.exports = Object.assign({}, { dbSettings, serverSettings })