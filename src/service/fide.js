'use strict'

const http = require('http')
const fs = require('fs')
const AdmZip = require('adm-zip')
const bigXml = require('big-xml')


class FidePlayerService {

    constructor(properties) {
        this.properties = properties
        this.fide = properties.db.fide
    }

    /**
     * This method does a http GET request to the fide download page for a zip XML data file.
     * @return { promise }
     * @param { string } fileName
     */
    download(fileName) {
        console.log('Initialised Download', fileName)

        return new Promise((resolve, reject) => {
            try {
                const path = `${this.fide.folder}/${fileName}`;
                let file = fs.createWriteStream(`${this.fide.folder}/${fileName}`)

                console.log('Executing HTTP GET', this.fide.url)

                http.get(this.fide.url, response => {
                    response.pipe(file)

                    file.on('finish', () => {
                        file.close()
                        resolve(file);
                    })
                }).on('error', error => {
                    fs.unlink(this.fide.folder)
                    reject(new Error(error))
                })
            } catch (error) {
                reject(new Error(error))
            }
        })
    }

    /**
     * This method takes the unzipped xml file and reads it into JSON where all other processes
     * outside of this service can just that data source.
     * @return { promise }
     * @param { string } file
     **/
    createJson(file) {

        const reader = bigXml.createReader(this.properties.db.fide.folder + this.properties.db.fide.xmlFile, /^(player)$/, {
            gzip: false
        })

        let counter = 0
        let players = []

        return new Promise((resolve, reject) => {
            try {
                reader.on('record', record => {
                    let p = record.children
                    let player = {}

                    try {
                        let rating = p[8]

                        player = {
                            id: parseInt(p[0].text, 10) || null,
                            name: p[1].text || null,
                            title: p[4].text || null,
                            sex: p[3].text || null,
                            country: p[2].text || null
                        }

                        if (typeof rating !== 'undefined' || typeof rating.text !== 'undefined') {
                            player.rating = parseInt(p[8].text, 10) || null
                        }
                    } catch (e) {
                        console.log(e)
                    }

                    try {
                        players.push(player)
                        counter++
                    } catch (error) {
                        reject(new Error(error))
                    }
                })
                const path = `${this.fide.folder}${file}`
                reader.on('end', () => {
                    fs.writeFile(path, JSON.stringify(players), 'UTF8', err => {
                        if (err) console.error(err)
                    })
                    resolve(file)
                })
            } catch (e) {
                console.log(e)
            }
        })
    }

    /**
     * This method takes a .zip file and unzips it to the same folder.
     * @return { promise }
     * @param { string } file
     */
    extract(file) {

        return new Promise((resolve, reject) => {
            if (file.indexOf('.zip') === -1) {
                reject(new Error('File must be stored as a .zip'))
            }

            const path = `${this.fide.folder}${file}`
            let zip = new AdmZip(path)
            let zipEntries = zip.getEntries()

            zipEntries.forEach(zipEntry => {
                if (zipEntry.entryName === this.fide.xmlFile) {
                    try {
                        zip.extractEntryTo(this.fide.xmlFile, this.fide.folder, false, true)
                        resolve('Extract complete.')
                    } catch (error) {
                        reject(new Error(error))
                    }
                } else {
                    reject(new Error('Unable to match file'))
                }
            })
        })
    }
}

// TESTING:
// const service = new FidePlayerService(require('./config.json'));
// const download = service.download('data.zip');
// service.extract('data.zip');
// service.createJson('data.json');

module.exports = FidePlayerService
