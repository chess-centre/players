import { mocked } from 'ts-jest/utils';
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
jest.mock('axios', () => {
    return {
        get: jest.fn().mockImplementation(() => Promise.resolve({ data: 'file.zip'}))
    }
});
jest.mock('AdmZip', () => {
    return {
        getEntries: jest.fn().mockImplementation(() => {
            return [
                {
                    entryName: 'file.xml',
                    getData: jest.fn().mockImplementation(() => '')
                }
            ]
        })
    }
});
jest.mock('parser', () => {
    return {
        parser: jest.fn().mockImplementation(() => MockedData)
    }
});


describe('getPlayers', () => {

    const MockedAdmZip = mocked(AdmZip, true);
    const MockedAxios = mocked(axios, true);
    const MockedParser = mocked(parser, true);

    it('successfully fetches data', async () => {

        const fide = new Fide();
        const players = await fide.getPlayers();

        expect(players).toBe(MockedData);
    });

});


describe.skip('getPlayers', () => {
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