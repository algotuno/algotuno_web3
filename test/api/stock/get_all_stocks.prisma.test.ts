import handler from "../../../pages/api/stock/get_all_stocks";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_all_stocks.ts", () => {

    test("When getting all stocks passes", async () => {
        // 1. mock the data
        const find_all_stocks_result = [
            {
              "stockID": 4,
              "tickerSymbol": "TEST1",
              "companyName": "Test1 Inc.",
              "exchange": "Test",
              "historicalStockPrice": [
                {
                  "Close": 161.509995
                },
                {
                  "Close": 162.509995
                }
              ]
            },
            {
              "stockID": 6,
              "tickerSymbol": "TEST2",
              "companyName": "TEST2 company",
              "exchange": "Test",
              "historicalStockPrice": [
                {
                  "Close": 13.04
                },
                {
                  "Close": 12.95
                }
              ]
            },
            {
              "stockID": 25,
              "tickerSymbol": "TEST3",
              "companyName": "TEST3 pte ltd",
              "exchange": "Test",
              "historicalStockPrice": [
                {
                  "Close": 18.790001
                },
                {
                  "Close": 18.700001
                }
              ]
            }
        ]
        
        const app_result = {
            "message" : `Found ${find_all_stocks_result.length} stocks`,
            "result"  : find_all_stocks_result 
        }

        prisma.stock.findMany = jest.fn().mockReturnValueOnce(find_all_stocks_result);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

    test("When getting all stocks fails expecting error", async () => {
        // 1. mock the data        
        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.stock.findMany = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });

    test("When using POST instead of GET expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'POST'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message": `ERROR: ${req.method} method used; this endpoint only accepts GET methods`});
    });

});