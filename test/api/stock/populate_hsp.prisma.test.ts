// import handler from "../../../pages/api/stock/populate_hsp";
// import getAndPopulateHSP from "../../../pages/api/stock/populate_hsp";
// import prisma from "../../../config/prisma";
// import {createMocks} from "node-mocks-http";

// describe("Test populate_hsp.ts", () => {

//     test("When getting all stocks with ML range passes", async () => {
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

//         jest.mock("../../../pages/api/stock/populate_hsp/getAndPopulateHSP");
//         const foo = require('../../../pages/api/stock/populate_hsp/getAndPopulateHSP')
//         foo.mockImplementation(()=>app_result);

//         prisma.stock.findFirst = jest.fn().mockReturnValueOnce(stock_findfirst_result);
//         console.log(foo());

//         // 2. input api call
//         const {req, res} = createMocks({
//             method: 'GET'
//         });

//         // 3. call the api
//         await handler(req, res);
//         expect(res._getStatusCode()).toBe(200);

//         // 4. verify its output
//         const res_output = JSON.parse(res._getData());
//         console.log(res_output);
//         expect(res_output).toEqual(foo);
//     });


//     test("When using GET instead of POST expecting error", async () => {
//         // 1. input api call
//         const {req, res} = createMocks({method: 'GET'});

//         // 2. call the api
//         await handler(req, res);
//         expect(res._getStatusCode()).toBe(406);

//         // 3. verify its output
//         const res_output = JSON.parse(res._getData());
//         console.log(res_output);
//         expect(res_output).toEqual({"message": `ERROR: ${req.method} method used; this endpoint only accepts POST methods`});
//     });


// });