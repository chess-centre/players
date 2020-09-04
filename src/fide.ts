'use strict';

import http from 'http';
import fs from 'fs';
import bigXml from 'big-xml';
import AdmZip from 'adm-zip';

interface Config {
    endpoint: string,
    outputPath: string,
}

interface Player {
    id: number | null,
    name?: string,
    title?: string,
    sex?: string,
    country?: string,
    rating?: number | null
}

class FidePlayerService {
  #endpoint: string;
  #outputPath: string;
  #tempPath: string = './'

  constructor(config: Config) {
    this.#endpoint = config.endpoint;
    this.#outputPath = config.outputPath
  }

  /**
   * This method does a http GET request to the fide download page for a zip XML data file.
   * @return { promise }
   * @param { string } fileName
   */
  public download(fileName: string) {
    console.log('Initialised Download', fileName);

    return new Promise((resolve, reject) => {
      try {
        const path = `${this.fide.folder}/${fileName}`;
        let file = fs.createWriteStream(`${this.fide.folder}/${fileName}`);

        console.log('Executing HTTP GET', this.fide.url);

        http
          .get(this.fide.url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
              file.close();
              resolve(file);
            });
          })
          .on('error', (error) => {
            fs.unlink(this.fide.folder);
            reject(new Error(error));
          });
      } catch (error) {
        reject(new Error(error));
      }
    });
  }

  /**
   * This method takes the unzipped xml file and reads it into JSON where all other processes
   * outside of this service can just that data source.
   * @return { promise }
   * @param { string } file
   **/
  createJson(file: string) {
    const reader = bigXml.createReader(this.properties.db.fide.folder + this.properties.db.fide.xmlFile, /^(player)$/, {
      gzip: false,
    });

    let counter = 0;
    let players: [Player];

    return new Promise((resolve, reject) => {
      try {
        reader.on('record', (record: any) => {
          let p = record.children;
          let player: Player;

            let rating: string | null | object = p[8];

            player = {
              id: parseInt(p[0].text, 10) || null,
              name: p[1].text || null,
              title: p[4].text || null,
              sex: p[3].text || null,
              country: p[2].text || null,
            };

            if (typeof rating !== 'undefined' || typeof rating.text !== 'undefined') {
              player.rating = parseInt(p[8].text, 10) || null;
            }


          try {
            players.push(player);
            counter++;
          } catch (error) {
            reject(new Error(error));
          }
        });
        const path = `${this.fide.folder}${file}`;
        reader.on('end', () => {
          fs.writeFile(path, JSON.stringify(players), 'UTF8', (err) => {
            if (err) console.error(err);
          });
          resolve(file);
        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  /**
   * This method takes a .zip file and unzips it to the same folder.
   * @return { promise }
   * @param { string } file
   */
  extract(file: string) {
    return new Promise((resolve, reject) => {
      if (file.indexOf('.zip') === -1) {
        reject(new Error('File must be stored as a .zip'));
      }

      const path = `${this.fide.folder}${file}`;
      let zip = new AdmZip(path);
      let zipEntries = zip.getEntries();

      zipEntries.forEach((zipEntry) => {
        if (zipEntry.entryName === this.fide.xmlFile) {
          try {
            zip.extractEntryTo(this.fide.xmlFile, this.fide.folder, false, true);
            resolve('Extract complete.');
          } catch (error) {
            reject(new Error(error));
          }
        } else {
          reject(new Error('Unable to match file'));
        }
      });
    });
  }
}

// TESTING:
// const service = new FidePlayerService(require('./config.json'));
// const download = service.download('data.zip');
// service.extract('data.zip');
// service.createJson('data.json');

module.exports = FidePlayerService;
