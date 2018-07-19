'use strict';

const repository = (db) => {
    const collection = db.collection('players');

    const createPlayer = (player) => {
        return new Promise((resolve, reject) => {

            if(!player) reject(new Error('Player is undefined'));

            const payload = {
                name: player.name,
                rating: player.rating,
                title: player.title
            };
            
            db.collection('players').insertOne(payload, (err, player) => {
                if (err) {
                  reject(new Error('An error occuered registring a user booking, err:' + err))
                }
                resolve(payload);
            })
        })
    }

    const getAllPlayers = () => {
        return new Promise((resolve, reject) => {
            const players = [];
            const cursor = collection.find({}, { title: 1, id: 1 });
            const addPlayer = (player) => {
                players.push(player);
            }
            const sendPlayers = (err) => {
                if (err) {
                    reject(new Error('An error occured fetching all players, err:' + err))
                }
                resolve(players.slice());
            }
            cursor.forEach(addPlayer, sendPlayers);
        });
    }

    const getPlayerById = (id) => {
        return new Promise((resolve, reject) => {
            const projection = { _id: 0, id: 1, title: 1, format: 1 }
            const sendPlayer = (err, player) => {
                if (err) {
                    reject(new Error(`An error occured fetching a player with id: ${id}, err: ${err}`))
                }
                resolve(player)
            }
            collection.findOne({ id: id }, projection, sendPlayer)
        })
    }

    const disconnect = () => {
        db.close();
    }

    return Object.create({
        getAllPlayers,
        getPlayerById,
        createPlayer,
        disconnect
    });
}

const connect = (connection) => {
    return new Promise((resolve, reject) => {
        if (!connection) {
            reject(new Error('connection db not supplied!'));
        }
        resolve(repository(connection))
    });
}

module.exports = Object.assign({}, { connect });