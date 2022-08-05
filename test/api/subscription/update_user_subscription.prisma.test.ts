import handler from "../../../pages/api/subscription/update_user_subscription";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test update_user_subscription.ts", () => {

    test("When updating a user's subscription with all valid inputs passes", async () => {
        // 1. mock the data
        const userID = "userID123";
        const subscriptionPlanID = 4;

        const upsert_subscription_results = {
            "subscriptionID": 10,
            "userID": "userID123",
            "subscriptionPlanID": 4
        }

        const app_result = {
            "message" : `Successfully inserted/updated ${userID}'s plan`,
            "result" : upsert_subscription_results
        }
     
        prisma.subscription.upsert = jest.fn().mockReturnValueOnce(upsert_subscription_results);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "user_id" : userID,
                "subscription_plan_id" : subscriptionPlanID
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

    test("When updating a user's subscription fails expecting error", async () => {
        // 1. mock the data
        const userID = "userID123";
        const subscriptionPlanID = 4;

        const errorMsg = {
            "message" : "mocked error"
        }

        prisma.subscription.upsert = jest.fn().mockRejectedValueOnce(errorMsg);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body : {
                "user_id" : userID,
                "subscription_plan_id" : subscriptionPlanID
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
    });

    test("When omitting user_id and subscription_plan_id in POST request expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'POST'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message" : "Specify the user_id and subscription_plan_id"});
    });


    test("When using GET instead of POST expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({method: 'GET'});

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({"message": `ERROR: ${req.method} method used; this endpoint only accepts POST methods`});
    });

});