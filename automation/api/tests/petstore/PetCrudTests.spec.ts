import { expect, request, test } from "@playwright/test";
import { EndPoints } from "../../../common/navigationEnum/EndPoints";
import { StatusCode } from "../../../helpers/apiStatusCodes/StatusCodes";
import Randomizer from "../../../helpers/randomzier/Randomizer";
import { IPet } from "../../../interfaces/PetInterfaces";
import path from "path";
const FormData = require('form-data');
import * as fs from 'fs';
import { ApplicationUrl } from "../../../common/navigationEnum/ApplicationUrl";
import axios from 'axios';


test.describe('sanity api tests for the pet store api', async () => {
    let randomizer: Randomizer;
    let randomNumber: number;
    let randomName: string;
    let randomCategory: string;
    let baseUrl = EndPoints.PET_STORE_BASE_URL;
    let OK: string = 'OK';
    let id: number = 900;
    let findByStatus: string = 'findByStatus';
    let uploadImage: string = 'uploadImage';
    let pet: string = 'pet'


    test.beforeEach(async () => {
        randomizer = new Randomizer();
        randomNumber = randomizer.getRandomNumbers;
        randomName = randomizer.getPetName;
        randomCategory = randomizer.getRandomDepartment
    })

    test('create a pet via POST request', async ({ request }) => {
        await test.step('create a new pet', async () => {
            const data = {
                "id": id,
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

            const response = await request.post(`${baseUrl}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data,
            })
            expect(response.status()).toBe(StatusCode.OK);
            expect(response.statusText()).toBe(OK)
        })
    })

    //-------------------------------------------------------------------
    test('upload an image directly to a pet endpoint', async ({ request }) => {
        await test.step('upload a pet image directly via api', async () => {
            const file = path.resolve(__dirname, '../../../images/pug.jpeg');
            const image = fs.readFileSync(file);
            const response = await request.post(`${baseUrl}/${pet}/${id}/uploadImage`, {
                headers: {
                    'Accept': "*/*",
                    'Content-Type': 'multipart/form-data',
                },
                multipart: {
                    file: {
                        name: file,
                        mimeType: 'image/jpeg',
                        buffer: image,
                    },
                }
            })
            expect(response.status()).toBe(StatusCode.OK);
        })
    });


    //-------------------------------------------------------------------
    test('retrieve pet details via GET request', async ({ request }) => {
        await test.step('fetch the data to validate the data is stored in the server from previous test', async () => {
            const data = {
                "id": id,
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
            const res = await request.get(`${baseUrl}/${pet}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            expect(res.status()).toBe(StatusCode.OK);
            expect(res.statusText()).toBe(OK);
            expect(await res.json()).toEqual(data);

        })
    })
    //-------------------------------------------------------------------
    test('update an existing pet', async ({ request }) => {
        const newData = {
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
        await test.step('update an existing pet from previous test', async () => {
            const response = await request.put(`${EndPoints.PET_STORE_BASE_URL}/${pet}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: newData,
            })
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('validate the data now matches the new updated data with specific properties', async () => {
            const res = await request.get(`${EndPoints.PET_STORE_BASE_URL}/${pet}/${id}`, {
            })
            const responseJson: IPet = await res.json();
            expect([responseJson.id, responseJson.name, responseJson.status]).toEqual([newData.id, newData.name, newData.status]);
        })
    })

    //------------------------------------------------------------------

    test('find pet by pending status #1', async ({ request }) => {
        await test.step('find a pet by pending status', async () => {
            const response = await request.get(`${baseUrl}/${pet}/${findByStatus}`, {
                params: {
                    status: 'pending'
                }
            });
            expect(response.ok()).toBeTruthy();
            expect(await response.json()).toContainEqual(expect.objectContaining({
                "id": 53365508,
                "name": 'Nemo',
            }))
        })
    })

    //------------------------------------------------------------------
    test('find pet by status #2', async ({ request }) => {
        await test.step('find a pet by available status', async () => {
            const response = await request.get(`${baseUrl}/${pet}/${findByStatus}`, {
                params: {
                    status: 'available'
                }
            });
            expect(response.ok()).toBeTruthy();
            expect(await response.json()).toContainEqual(expect.objectContaining({
                "name": 'Poki',
            }))
        })
    })

    //------------------------------------------------------------------

    test('find pet by status #3', async ({ request }) => {
        await test.step('find a pet by sold status', async () => {
            const response = await request.get(`${baseUrl}/${pet}/${findByStatus}`, {
                params: {
                    status: 'sold'
                }
            });
            expect(response.ok()).toBeTruthy();
            expect(await response.json()).toContainEqual(expect.objectContaining({
                "name": 'Chappi dog',
            }))
        })
    })


    //-------------------------------------------------------------------

    test('delete an existing pet', async ({ request }) => {
        await test.step('delete pet with the id from previous test', async () => {
            const response = await request.delete(`${EndPoints.PET_STORE_BASE_URL}/${pet}/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('validate there is no such resource with the deleted id anymore', async () => {
            const res = await request.get(`${baseUrl}/${pet}/${id}`);
            expect(res.status()).toBe(StatusCode.NOT_FOUND);
            const responseJson = await res.json();
            expect(responseJson).toHaveProperty('message', 'Pet not found');
        })
    })
})

