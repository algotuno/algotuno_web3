import handler from "../../../pages/api/stock/delete_stock";
import * as auth_check from '../../../config/auth_check';
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";
import fetchMock from 'jest-fetch-mock';

describe("Test delete_stock.ts", () => {

    fetchMock.enableMocks()

    test("Delete Stock with valid ticker symbol and auth key expecting success", async () => {
        // 1. mock the data
        const ticker_symbol = "TEST";

        const findfirst_stock_result = {
            "stockID": 6,
            "tickerSymbol": "TEST",
            "companyName": "TEST inc.",
            "exchange": "TEST"
        };

        const delete_stock_result = {
            "count": 1
        };

        const app_result = {
            "message" : `Deleted stock ${ticker_symbol}`,
            "result" : delete_stock_result
        }

        // const authorization_check = jest.fn(()=>true);

        // jest.mock('../../../config/auth_check.ts', () =>({
        //     ...(jest.requireActual('../../../config/auth_check.ts')),
        //     authorization_check:jest.fn()
        // }))
        
        // authorization_check.mockReturnValue(true);

        const ac = require('../../../config/auth_check')
        // const spy = jest.spyOn(auth_check.authorization_check, )

        
        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(findfirst_stock_result);
        prisma.stock.deleteMany = jest.fn().mockReturnValueOnce(delete_stock_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol
            },
            headers:{
                'authorization': 'NEXT_PUBLIC_API_SECRET_KEY 9ddf045fa71e89c6d0d71302c0c5c97e'
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

});