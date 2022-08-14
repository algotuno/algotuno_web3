import handler from "../../../pages/api/stock/get_all_stocks_with_hsp";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test get_all_stocks_with_hsp.ts", () => {

    test("When getting all stocks with HSP data passes", async () => {
        // 1. mock the data
        const hsp_findmany_result = [
            {
                "stockID": 4,
                "tickerSymbol": "TEST",
                "companyName": "TEST Inc.",
                "exchange": "NasdaqGS",
                "historicalStockPrice": [
                    {
                        "stockID": 4,
                        "Date": "2017-06-13T00:00:00.000Z",
                        "DateString": "13-JUN-2017",
                        "Open": 36.790001,
                        "High": 36.862499,
                        "Low": 36.287498,
                        "Close": 36.647499,
                        "Volume": 136661600
                    },
                    {
                        "stockID": 4,
                        "Date": "2017-06-14T00:00:00.000Z",
                        "DateString": "14-JUN-2017",
                        "Open": 36.875,
                        "High": 36.875,
                        "Low": 35.959999,
                        "Close": 36.290001,
                        "Volume": 126124800
                    }
                ]
            },
            {
                "stockID": 5,
                "tickerSymbol": "TEST2",
                "companyName": "TEST2 Inc.",
                "exchange": "NasdaqGS",
                "historicalStockPrice": [
                    {
                        "stockID": 5,
                        "Date": "2017-06-13T00:00:00.000Z",
                        "DateString": "13-JUN-2017",
                        "Open": 36.790001,
                        "High": 36.862499,
                        "Low": 36.287498,
                        "Close": 36.647499,
                        "Volume": 136661600
                    },
                    {
                        "stockID": 5,
                        "Date": "2017-06-14T00:00:00.000Z",
                        "DateString": "14-JUN-2017",
                        "Open": 36.875,
                        "High": 36.875,
                        "Low": 35.959999,
                        "Close": 36.290001,
                        "Volume": 126124800
                    }
                ]
            },
            {
                "stockID": 6,
                "tickerSymbol": "TEST3",
                "companyName": "TEST3 Inc.",
                "exchange": "NasdaqGS",
                "historicalStockPrice": []
            }
        ]
        
        const updated_hsp_results = [
            {
                "stockID" : 4,
                "tickerSymbol" : "TEST",
                "companyName" : "TEST Inc.",
                "exchange"  : "NasdaqGS",
                "latest_stock_date" : "14-JUN-2017",
                "earliest_stock_date" : "13-JUN-2017"
            },
            {
                "stockID" : 5,
                "tickerSymbol" : "TEST2",
                "companyName" : "TEST2 Inc.",
                "exchange"  : "NasdaqGS",
                "latest_stock_date" : "14-JUN-2017",
                "earliest_stock_date" : "13-JUN-2017"
            },
            {
                "stockID" : 6,
                "tickerSymbol" : "TEST3",
                "companyName" : "TEST3 Inc.",
                "exchange"  : "NasdaqGS",
                "latest_stock_date" : "No HSP Found",
                "earliest_stock_date" : "No HSP Found"
            }
        ]

        const app_result = {
            "message":"done",
            "result":updated_hsp_results
        }

        prisma.stock.findMany = jest.fn().mockReturnValueOnce(hsp_findmany_result);

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

    test("When getting all stocks with HSP data fails expecting error", async () => {
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

})
