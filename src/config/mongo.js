const { MongoClient } = require('mongodb')

const dbName = 'players'

const connect = (options, mediator) => {
  mediator.once('boot.ready', async () => {
    const mongo = new MongoClient('mongodb://localhost:27017')

    mongo.connect((err, client) => {
      if (err) return mediator.emit('db.error', error)
      const db = client.db(dbName)
      console.log(db)
      mediator.emit('db.ready', db)
    })
  })
}

module.exports = Object.assign({}, { connect })
