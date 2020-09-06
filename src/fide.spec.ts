import Fide from './fide';
import axios from 'axios';
import * as AdmZip from 'adm-zip';
import * as parser from 'fast-xml-parser';

const MockedData = {
    playerslist: {
        player: [
            {
                id: 1,
                name: 'player 1',
                rating: 1000
            }
        ]
    },
};
jest.mock('axios');
jest.mock('adm-zip');
jest.mock('fast-xml-parser');

const MockedAxios = axios as jest.Mocked<typeof axios>;
const MockedParser = parser as jest.Mocked<typeof parser>;
MockedAxios.get.mockResolvedValue({ data: {} });
MockedParser.parse.mockReturnValue(MockedData);

AdmZip.prototype.getEntries = jest.fn().mockImplementation(() => ([
    {
        getData: jest.fn().mockReturnValue('xml')
    }
]));

describe("Fide", () => {
    describe('getPlayers', () => {
        it('fetches successfully data from FIDE website', async () => {
            const fide = new Fide();
            const players = await fide.getPlayers();
            expect(players).toBe(MockedData.playerslist.player);
        });

    });
    describe('getPreviousPlayersList', () => {
        it('fetches successfully legacy data from FIDE website', async () => {
            const fide = new Fide();
            const config = {
                ratingType: 'rapid',
                month: 'jan',
                year: 2020
            };
            const players = await fide.getPreviousPlayersList(config);
            expect(players).toBe(MockedData.playerslist.player);
        });
    });
})


