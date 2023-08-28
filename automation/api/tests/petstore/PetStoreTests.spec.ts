import { expect, request, test } from "@playwright/test";
import { EndPoints } from "../../../common/navigationEnum/EndPoints";
import { IPet } from "../../../interfaces/PerInterfaces";
import { StatusCode } from "../../../helpers/apiStatusCodes/StatusCodes";
import Randomizer from "../../../helpers/randomzier/Randomizer";

test.describe('sanity api tests for the pet store api', async () => {
    let randomizer: Randomizer;
    let randomNumber: number;
    let baseUrl = EndPoints.PET_STORE_BASE_URL;
    let OK: string = 'OK';

    test.beforeEach(async () => {
        randomizer = new Randomizer();
        randomNumber = randomizer.getRandomNumbers;
    })

    test('create a pet via POST request', async ({ request }) => {
        await test.step('create a new pet', async () => {
            const petData: IPet = {
                "id": 511,
                "category": {
                    "id": 610,
                    "name": "my pet category"
                },
                "name": "Poki",
                "photoUrls": [
                    "https://ibb.co/jM49Hrv"
                ],
                "tags": [
                    {
                        "id": 710,
                        "name": "dog-tag"
                    }
                ],
                "status": "available"
            }
            const response = await request.post(`${baseUrl}/pet`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: petData,
            })
            expect(response.status()).toBe(StatusCode.OK);
            expect(response.statusText()).toBe(OK)
        })
    })

    test('retrieve pet details via GET request', async ({ request }) => {
        await test.step('fetch the data to validate the data is stored in the server from previous test', async () => {
            const data: IPet = {
                "id": 511,
                "category": {
                    "id": 610,
                    "name": "my pet category"
                },
                "name": "Poki",
                "photoUrls": [
                    "https://ibb.co/jM49Hrv"
                ],
                "tags": [
                    {
                        "id": 710,
                        "name": "dog-tag"
                    }
                ],
                "status": "available"
            }
            const res = await request.get(`${baseUrl}/pet/511`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            expect(res.status()).toBe(StatusCode.OK);
            expect(res.statusText()).toBe(OK);
            expect(await res.json()).toEqual(data);

        })
    })

    test('update an existing pet', async ({ request }) => {
        await test.step('update an existing pet with id of 511', async () => {
            const newData: IPet = {
                "id": 511,
                "category": {
                    "id": 700,
                    "name": "Animals"
                },
                "name": "Max",
                "photoUrls": [
                    "https://ibb.co/jM49Hrv"
                ],
                "tags": [
                    {
                        "id": 650,
                        "name": "animal-tag"
                    }
                ],
                "status": "not available"
            }

            const response = await request.put(`${EndPoints.PET_STORE_BASE_URL}/pet/511`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: newData,
            })
            expect(response.status()).toBe(StatusCode.OK);
            expect(response.status()).toBe(OK);
        })
    })

    test('delete an existing pet', async ({ request }) => {
        await test.step('delete pet with the id of 511', async () => {
            const response = await request.delete(`${EndPoints.PET_STORE_BASE_URL}/pet/511`);
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('validate there is no such resource with the deleted id anymore', async () => {
            const res = await request.get(`${baseUrl}/pet/511`);
            expect(res.status()).toBe(StatusCode.NOT_FOUND);
        })
    })
})
