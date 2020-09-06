import Fide from './fide';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getPlayers', () => {
    it('fetches successfully data from an FIDE website', async () => {
        const data = {
            playerslist: {
                player: [
                    {
                        fideid: 1,
                        name: 'player 1',
                        country: 'UK',
                        sex: 'female',
                        title: 'GM',
                        w_title: '',
                        o_title: '',
                        foa_title: '',
                        rating: 2800,
                        games: 0,
                        k: 20,
                        birthday: 1900,
                        flag: ''
                    }
                ]
            },
        };

        mockedAxios.get.mockImplementationOnce(() => Promise.resolve(data));

        const fide = new Fide();

        await expect(fide.getPlayers()).resolves.toEqual(data);
    });

});