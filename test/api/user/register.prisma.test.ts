import handler from "../../../pages/api/user/register";
import prisma from "../../../config/prisma";
import {createMocks} from "node-mocks-http";
import fetchMock from 'jest-fetch-mock';

describe("Test register.ts", () => {

    test("Register user with valid inputs expecting success", async () => {
        // 1. mock the data
        const username = "TESTusername";
        const password = "TESTpassword";
        const email = "TESTemail@email.com";

        const register_user_result = {
            id: 'testID',
            name: null,
            email: 'testing123@email.com',
            username: 'testing123',
            password: 'TESTpassword',
            emailVerified: null,
            image: null
        }

        const update_subscription_result = {
            message: "Successfully inserted/updated testID's plan",  
            result: {
              subscriptionID: 18,
              userID: 'testID',
              subscriptionPlanID: 4
            }
        }

        const app_result = {
            message : `Username ${username} Created Successfully`
        }

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "username" : username,
                "password" : password,
                "email"    : email
            }
        });

        //https://stackoverflow.com/questions/54703341/how-to-mock-const-method-in-jest
        const nextauth = require("../../../pages/api/auth/[...nextauth]");
        const registerSpy = jest.spyOn(nextauth,"registerBasicUser");
        registerSpy.mockImplementation(()=> {return register_user_result});

        fetchMock.enableMocks()
        fetchMock.mockResponseOnce(JSON.stringify(update_subscription_result));

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(200);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(app_result);
        fetchMock.resetMocks() 
    });

    test("Register user with invalid inputs expecting error", async () => {
        // 1. mock the data
        const username = "TESTusername";
        const password = "TESTpassword";
        const email = "TESTemail@email.com";

        const register_user_result = {
            id: 'testID',
            name: null,
            email: 'testing123@email.com',
            username: 'testing123',
            password: 'TESTpassword',
            emailVerified: null,
            image: null
        }

        const update_subscription_result = {
            message: "Successfully inserted/updated testID's plan",  
            result: {
              subscriptionID: 18,
              userID: 'testID',
              subscriptionPlanID: 4
            }
        }

        const errorMsg = {
            "message" : "mocked error"
        }

        // 2. input api call
        const {req, res} = createMocks({
            method: 'POST',
            body: {
                "username" : username,
                "password" : password,
                "email"    : email
            }
        });

        //https://stackoverflow.com/questions/54703341/how-to-mock-const-method-in-jest
        const nextauth = require("../../../pages/api/auth/[...nextauth]");
        const registerSpy = jest.spyOn(nextauth,"registerBasicUser");
        registerSpy.mockImplementation(()=> {throw errorMsg});

        fetchMock.enableMocks()
        fetchMock.mockResponseOnce(JSON.stringify(update_subscription_result));

        // 3. call the api
        await handler(req, res);
        expect(res._getStatusCode()).toBe(406);

        // 4. verify its output
        const res_output = JSON.parse(res._getData());
        console.log(res_output);
        expect(res_output).toEqual(errorMsg);
        fetchMock.resetMocks() 
    });

    test("When using GET request intead of POST request expecting welcome message", async () => {
        // 1. mock the data
        const welcome_message = {
            "message" : "welcome to register page"
        }

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
        expect(JSON.parse(res_output)).toEqual(welcome_message);
        fetchMock.resetMocks() 
    });

});
