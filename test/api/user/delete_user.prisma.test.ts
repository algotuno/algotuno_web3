import handler from "../../../pages/api/user/delete_user";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";

describe("Test delete_user.ts", () => {

    test("Delete user with valid username passes expecting success", async () => {
        // 1. mock the data
        const user_details = {
            "id": "id354",
            "name": null,
            "email": "test354@hotmail.com",
            "username": "test354",
            "password": "password",
            "emailVerified": null,
            "image": null
        }
        
        const app_result = {
            "message": "Deleted test354 from User",
            "result": user_details
        }

        prisma.user.findFirst = jest.fn().mockReturnValueOnce(user_details);
        prisma.user.delete = jest.fn().mockReturnValueOnce(user_details);

        // 2. input api call
        const {req, res} = createMocks({
            method  :   'POST',
            body: {
                'username': 'test354'
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

    test("When omitting username in POST request expecting error", async () => {

        // 1. mock the data
        const errorMsg = "username Null or undefined";

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST'
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({
            "message" : errorMsg
        });
    });

    test("Delete user with invalid username fails expecting error", async () => {
        // 1. mock the data
        
        const app_result = {
            "message": "User test354 does not exist"
        }

        prisma.user.findFirst = jest.fn().mockReturnValueOnce(null);

        // 2. input api call
        const {req, res} = createMocks({
            method  :   'POST',
            body: {
                'username': 'test354'
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
    });

    test("Delete User with invalid username but User does not exist and fails expecting P2025 error", async () => {
        // 1. mock the data
        const input_username = "test354"

        const error = {
            "code" : "P2025"
        }

        prisma.user.findFirst = jest.fn().mockRejectedValueOnce(error);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "username" : "test354"
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({
            "message":`Failed to delete ${input_username} from User; ${input_username} is not a User`
        });
    });

    test("Delete User fails expecting generic error", async () => {
        // 1. mock the data
        const error = {
            "code" : "P202512345",
            "message" : "mocked error"
        }

        prisma.user.findFirst = jest.fn().mockRejectedValueOnce(error);

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "username" : "test354"
            }
        });

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({
            "message" : "mocked error"
        });
    });




    test("When using GET instead of POST expecting error", async () => {
        // 1. input api call
        const {req, res} = createMocks({
            method: 'GET'
        });

        // 2. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 3. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual({
            "message" : `ERROR: ${req.method} method used; this endpoint only accepts POST methods`
        });
    });
});