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
    ratingType: string;
    month: string;
    year: number;
}
export default class Fide {
    #private;
    private constructUrl;
    getPlayers(url?: string): Promise<any>;
    getPreviousPlayersList(options: Options): Promise<any>;
}
