import { expect, test } from '@playwright/test'
import { EndPoints } from '../../../common/navigationEnum/EndPoints'
import { StatusCode } from '../../../helpers/apiStatusCodes/StatusCodes';
import { IUser } from '../../../interfaces/PetInterfaces';
import Randomizer from '../../../helpers/randomzier/Randomizer';

test.describe.only('api crud tests for users endpoint', async () => {
    let baseUrl = EndPoints.PET_STORE_BASE_URL;
    let user: string = 'user';
    let randomizer: Randomizer;
    let randomEmail: string;
    let randomPhoneNumber: string;
    let firstName: string;
    let lastName: string;
    let id: number;
    let userName: string;
    let password: string;

    test.beforeEach(async () => {
        randomizer = new Randomizer();
        randomEmail = randomizer.getRandomEmail;
        randomPhoneNumber = randomizer.getRandomPhoneNumber;
        firstName = randomizer.getRandomFirstName;
        lastName = randomizer.getRandomLastName;
        id = randomizer.getRandomNumbers;
        userName = randomizer.getRandomDomainWords;
        password = randomizer.getRandomWords;
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })


    test('create user', async ({ request }) => {
        const data = [{
            "id": 555,
            "username": "jon11",
            "firstName": "John",
            "lastName": "Doe",
            "email": randomEmail,
            "password": "12345",
            "phone": randomPhoneNumber,
            "userStatus": 0
        },
        {
            "id": 777,
            "username": "jane11",
            "firstName": "Jane",
            "lastName": "Doe",
            "email": randomEmail,
            "password": "112212",
            "phone": randomPhoneNumber,
            "userStatus": 1
        },
        ]
        await test.step('create multiple users', async () => {
            const response = await request.post(`${baseUrl}/${user}/createWithArray`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data
            })
            expect(response.status()).toBe(StatusCode.OK);
        })
    })

    //------------------------------------------------------

    test('modify user details', async ({ request }) => {
        const newData = {
            "id": 555,
            "username": "johndoe12",
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@test.test",
            "password": "111222",
            "phone": "+0508154",
            "userStatus": 1
        }
        await test.step('modify John Doe details', async () => {
            const response = await request.put(`${baseUrl}/${user}/jon11`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: newData,
            });
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('retrieve the data with the new username and validate the data is updated', async () => {
            const response = await request.get(`${baseUrl}/${user}/johndoe12`);
            const responseJson: IUser = await response.json()
            expect(responseJson).toEqual(newData);
            expect(response.status()).toBe(StatusCode.OK)
        })
    })

    //------------------------------------------------------

    test('delete user', async ({ request }) => {
        await test.step('get jane doe user first and validate it exists', async () => {
            const response = await request.get(`${baseUrl}/${user}/jane11`);
            const responseJson: IUser = await response.json();
            expect(response.status()).toBe(StatusCode.OK)
            expect(responseJson).toBeDefined();
            expect(responseJson.firstName).toBe('Jane')
            expect(responseJson.lastName).toBe('Doe')
        })

        await test.step('delete the user Jane Doe', async () => {
            const response = await request.delete(`${baseUrl}/${user}/jane11`);
            expect(response.status()).toBe(StatusCode.OK);
            expect(response.ok).toBeTruthy();
        })

        await test.step('fetch data again and validate user Jane Doe does not exist', async () => {
            const response = await request.get(`${baseUrl}/${user}/jane11`);
            expect(response.status()).toBe(StatusCode.NOT_FOUND);
            const responseJson = await response.json();
            expect(responseJson).toHaveProperty('message', 'User not found');
        })
    })

    //------------------------------------------------------

    test('create user with unsupported properties', async ({ request }) => {
        const userData = {
            "id": "id",
            "username": userName,
            "firstName": firstName,
            "lastName": lastName,
            "email": randomEmail,
            "password": password,
            "phone": randomPhoneNumber,
            "userStatus": 0
        }
        await test.step('create a user with a string type status and validate server responds with a server error', async () => {
            const response = await request.post(`${baseUrl}/${user}`, {
                headers: {
                    'Content-Type': 'application/json',
                }, data: userData
            })
            expect(response.status()).not.toBe(StatusCode.OK);
            expect(response.status()).toBe(StatusCode.SERVER_ERROR);
        })
    })
})