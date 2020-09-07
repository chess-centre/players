import axios from 'axios';
import { memoize } from 'decko';
import * as AdmZip from 'adm-zip';
import * as parser from 'fast-xml-parser';

export interface PlayersList {
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

export interface Options {
  ratingType: string,
  month: string,
  year: number
}

export default class Fide {
  #url: string = 'http://ratings.fide.com/download/standard_rating_list_xml.zip';

  private constructUrl({ ratingType, month, year }: Options) {
    return `http://ratings.fide.com/download/${ratingType}_${month}${year - 2000}frl_xml.zip`;
  }

  @memoize
  public async getPlayers(url: string = this.#url): Promise<any> {
    const response = await axios.get(url, { responseType: 'arraybuffer',  headers: {
      crossorigin: true
    }});
    const zip = new AdmZip(response.data);
    const zipEntries = zip.getEntries();
    const xml = zipEntries[0].getData().toString();
    const {
      playerslist: { player },
    }: PlayersList = parser.parse(xml);
    return player;
  }

  @memoize
  public async getPreviousPlayersList(options: Options): Promise<any> {
      const url = this.constructUrl(options);
      return this.getPlayers(url);
  }
}
