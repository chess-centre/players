import axios from 'axios';
import { memoize } from 'decko';
import * as AdmZip from 'adm-zip';
import * as parser from 'fast-xml-parser';

interface Playerslist {
  playerslist: {
    player: Array<Player>;
  };
}

export interface Player {
  fideid: number;
  name: string;
  country: string;
  sex: string;
  title: string;
  w_title: string;
  o_title: string;
  foa_title: string;
  rating: number;
  games: number;
  k: number;
  birthday: number;
  flag: string;
}

export default class Fide {
  #url: string = 'http://ratings.fide.com/download/standard_rating_list_xml.zip';

  @memoize
  async getPlayers(): Promise<Player[]> {
    console.log('GET', this.#url);
    const response = await axios.get(this.#url, { responseType: 'arraybuffer' });
    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();
    const xml = zipEntries[0].getData().toString();
    const {
      playerslist: { player },
    }: Playerslist = parser.parse(xml);
    return player;
  }
}
