const MongoClient = require('mongodb')

const getMongoURL = (options) => {
  const url = 'mongodb://localhost:27017/players'
  return url
}

const connect = (options, mediator) => {
  mediator.once('boot.ready', () => {
    MongoClient.connect(
            getMongoURL(options), {
              db: options.dbParameters(),
              server: options.serverParameters()
            }, (err, db) => {
              if (err) {
                mediator.emit('db.error', err)
              }
              mediator.emit('db.ready', db)
            })
  })
}

module.exports = Object.assign({}, { connect })
