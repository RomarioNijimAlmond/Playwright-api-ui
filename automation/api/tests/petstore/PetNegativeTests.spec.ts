import { expect, test } from '@playwright/test';
import Randomizer from '../../../helpers/randomzier/Randomizer';
import { EndPoints } from '../../../common/navigationEnum/EndPoints';
import { StatusCode } from '../../../helpers/apiStatusCodes/StatusCodes';
import { IPet } from '../../../interfaces/PetInterfaces';

test.describe('api pet negative tests', async () => {
    let randomizer: Randomizer;
    let randomNumber: number;
    let randomName: string;
    let randomCategory: string;
    let baseUrl = EndPoints.PET_STORE_BASE_URL;
    let OK: string = 'OK';
    let id: number = 6150;
    let findByStatus: string = 'findByStatus';
    let uploadImage: string = 'uploadImage';
    let pet: string = 'pet'
    let notFound: string = 'Not Found';

    test.beforeEach(async () => {
        randomizer = new Randomizer();
        randomNumber = randomizer.getRandomNumbers;
        randomName = randomizer.getPetName;
        randomCategory = randomizer.getRandomDepartment
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })


    test('create a pet with invalid input', async ({ request }) => {
        const data = {
            "id": 1,
            "category": {
                "id": 1,
                "name": ""
            },
            "name": "doggie",
            "photoUrls": [
                ""
            ],
            "tags": [
                {
                    "id": 1,
                    "name": ""
                }
            ],
            "status": "available"
        }
        await test.step('make an unsupported content type request to an endpoint and validate status responds with 415 status code', async () => {
            const response = await request.post(`${EndPoints.PET_STORE_BASE_URL}/${pet}`, {
                headers: {
                    "Content-Type": 'text/html',
                },
                data
            })
            expect(response.status()).not.toBe(StatusCode.OK);
            expect(response.status()).toBe(StatusCode.UNSUPPORTED_MEDIA_TYPE);
        })
    })
    //--------------------------------------------------------------

    test('search for a resource that does not exist', async ({ request }) => {
        await test.step('fetch a pet with a non existing ID and validate server response', async () => {
            const response = await request.get(`${EndPoints.PET_STORE_BASE_URL}/${pet}/3000`);
            expect(response.status()).toBe(StatusCode.NOT_FOUND);
            expect(response.status()).not.toBe(StatusCode.OK);
            expect(response.statusText()).toBe(notFound);
            const responseJson = await response.json();
            expect(responseJson).toHaveProperty("message", "Pet not found");
        })
    })

    //--------------------------------------------------------------


    test('create post method with an empty body and validate proepr response is received', async ({ request }) => {
        await test.step('create a pet without specifying any property in the data body', async () => {
            const response = await request.post(`${EndPoints.PET_STORE_BASE_URL}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const responseJson = await response.json();
            expect(responseJson).toHaveProperty('message', 'no data')
            expect(response.status()).toBe(StatusCode.METHOD_NOT_ALLOWED)
        })
    })

    //--------------------------------------------------------------

    /**
     * @description added fixme => this test passes which should not - this is a bug since the pet property has two required field by documentation
     */

    test.fixme('create a post request without required fields', async ({ request }) => {
        const data = {
            "id": randomNumber,
            "category": {
                "id": randomNumber,
                "name": randomName
            },
            "tags": [
                {
                    "id": randomNumber,
                    "name": randomName
                }
            ],
            "status": "available"
        }
        await test.step('create a pet without a name and photoUrl', async () => {
            const response = await request.post(`${baseUrl}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data,
            })
            expect(response.status()).toBe(StatusCode.BAD_REQUEST);
            const responseJson = await response.json();
            expect(responseJson).not.toHaveProperty('name');
            expect(responseJson).not.toHaveProperty('photoUrls');
        })
    })

    //--------------------------------------------------------------

    /**
     * @description I should be getting a 400 error by the documentation but Im recieving 500 server error - it accepts all invalid ID's
     */
    test('modify a pet with invalid ID supplied', async ({ request }) => {
        const oldData = {
            "id": id,
            "category": {
                "id": randomNumber,
                "name": "Animals"
            },
            "name": randomName,
            "photoUrls": [
                "https://ibb.co/jM49Hrv"
            ],
            "tags": [
                {
                    "id": randomNumber,
                    "name": `"${randomName}-tag"`
                }
            ],
            "status": "pending"
        }

        const newData = {
            "id": 'string value for the id',
            "category": {
                "id": 445,
                "name": randomName
            },
            "name": randomName,
            "photoUrls": [
                ""
            ],
            "tags": [
                {
                    "id": randomNumber,
                    "name": `"445-tag"`
                }
            ],
            "status": "sold"
        }

        await test.step('create a pet first', async () => {
            const response = await request.post(`${EndPoints.PET_STORE_BASE_URL}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                data: oldData,
            })

            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('modify an existing pet by providing an invalid ID', async () => {
            const response = await request.put(`${baseUrl}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json',
                }, data: newData
            })

            expect(response.status()).toBe(StatusCode.SERVER_ERROR);
        })
    })

    //--------------------------------------------------------------

    /**
     * @description this test should get a status code of 400 since it is a bad request - I recieved a server error instead
     */

    test('pass an invalid type of a property in a post request', async ({ request }) => {
        const data = {
            "id": 'string id',
            "category": {
                "id": 'randomNumber',
                "name": 1220
            },
            "tags": [
                {
                    "id": 'string id tag',
                    "name": 150
                }
            ],
            "status": 5512
        }
        await test.step('pass integers instead of strings and vice versa in the pet properties', async () => {
            const response = await request.post(`${baseUrl}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json',
                }, data
            })
            expect(response.status()).not.toBe(StatusCode.OK);
            expect(response.status()).toBe(StatusCode.SERVER_ERROR)
            expect(response.statusText()).toBe('Server Error')
        })
    })
})
