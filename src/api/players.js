'use strict'
const status = require('http-status');

module.exports = (app, options) => {
  const {repo} = options

  app.get('/players', (req, res, next) => {
    repo.getAllPlayers().then(players => {
      res.status(status.OK).json(players)
    }).catch(next)
  });

  app.get('/players/:id', (req, res, next) => {
    repo.getPlayerById(req.params.id).then(player => {
      res.status(status.OK).json(player)
    }).catch(next)
  });

  app.post('/players', (req, res, next) => {
      console.log('POST PLAYER', req.body);
      repo.createPlayer(req.body).then(player => {
          res.status(status.OK).json(player)
      }).catch(next);
  });
}