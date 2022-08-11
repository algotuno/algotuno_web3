import handler from "../../../pages/api/stock/populate_hsp";
import {getHSP} from "../../../pages/api/stock/populate_hsp";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

// describe("Test populate_hsp.ts", () => {

//     test("When populating stock HSP passes", async () => {
//         // 1. mock the data
//         const ticker_symbol = "TEST";

//         const stock_findfirst_result = {
//             "stockID" : 4
//         }

//         const populate_hsp_results = {
//             "count" : 5
//         }

//         const app_result = {
//             "message":`Inserted ${populate_hsp_results.count} records for ${ticker_symbol}`
//         }

//         // 2. input api call
//         const {req, res} = createMocks({
//             method: 'POST',
//             body:{
//                 "ticker_symbol" : ticker_symbol,
//                 "start_date" : 12345,
//                 "end_date" : 123456
//             }
//         });

//         // const nextauth = require("../../../pages/api/auth/[...nextauth]");
//         // const registerSpy = jest.spyOn(nextauth,"registerBasicUser");
//         // registerSpy.mockImplementation(()=> {return register_user_result});

//         const populate = require("../../../pages/api/stock/populate_hsp");
//         const populateSpy = jest.spyOn(populate,"getAndPopulateHSP");
//         populateSpy.mockImplementation(()=>{return {
//             "status":200, "message":app_result.message
//         }});

//         // jest.mock("../../../pages/api/stock/populate_hsp/getAndPopulateHSP");
//         // const foo = require('../../../pages/api/stock/populate_hsp/getAndPopulateHSP')
//         // foo.mockImplementation(()=>app_result);

//         prisma.stock.findFirst = jest.fn().mockReturnValueOnce(stock_findfirst_result);
//         // console.log(foo());

//         // 3. call the api
//         await handler(req, res);
//         expect(res._getStatusCode()).toBe(200);

//         // 4. verify its output
//         const res_output = JSON.parse(res._getData());
//         console.log(res_output);
//         expect(res_output).toEqual(app_result);
//     });

// });

describe("Test getAndPopulateHSP function", () => {

    beforeEach(() => {
        jest.resetModules();
      });

    test("When populating stock HSP passes2", async () => {
        const ticker_symbol = "GOOG";
        const stock_id = 45;
        const start_date = 1659609344;
        const end_date = 1659779344;

        const hsp_createmany_result = {
            count : 2
        }

        const stock_findfirst_result = {
            "stockID" : 45
        }

        const getHSP_result = [
            {
                "stockID" : 45,
                "Date" : "2022-08-04T00:00:00.00Z",
                "DateString" : "4-AUG-2022",
                "Open" : 123.01,
                "High" : 127.34,
                "Low"  : 120.00,
                "Close": 124.55,
                "Volume": 12345 
            },
            {
                "stockID" : 45,
                "Date" : "2022-08-05T00:00:00.00Z",
                "DateString" : "5-AUG-2022",
                "Open" : 123.01,
                "High" : 127.34,
                "Low"  : 120.00,
                "Close": 124.55,
                "Volume": 12345 
            }
        ];
        
        const populateHSP_result = {
            "status"  : 200,
            "message" : "Inserted 2 records for GOOG" 
        }

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "ticker_symbol" : ticker_symbol,
                "start_date" : start_date,
                "end_date"   : end_date
            }
        });    

        prisma.stock.findFirst = jest.fn().mockReturnValueOnce(stock_findfirst_result);

        //https://stackoverflow.com/questions/54703341/how-to-mock-const-method-in-jest
        const populate_hsp_api = require("../../../pages/api/stock/populate_hsp");
        const getHSP = jest.spyOn(populate_hsp_api,"getHSP");
        getHSP.mockImplementation(()=>{return getHSP_result});

        // prisma.historical_Stock_Price.createMany = jest.fn().mockReturnValueOnce(hsp_createmany_result)

        const populateHSP = jest.spyOn(populate_hsp_api,"populateHSP");
        populateHSP.mockImplementation( ()=>{return populateHSP_result})
        prisma.historical_Stock_Price.createMany = jest.fn().mockReturnValueOnce(hsp_createmany_result)

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(populateHSP_result);
    
    })
});