import { expect, request, test } from "@playwright/test";
import { EndPoints } from "../../../common/navigationEnum/EndPoints";
import { StatusCode } from "../../../helpers/apiStatusCodes/StatusCodes";
import Randomizer from "../../../helpers/randomzier/Randomizer";
import { IPet } from "../../../interfaces/PerInterfaces";
const FormData = require('form-data');

test.describe('sanity api tests for the pet store api', async () => {
    let randomizer: Randomizer;
    let randomNumber: number;
    let randomName: string;
    let randomCategory: string;
    let baseUrl = EndPoints.PET_STORE_BASE_URL;
    let OK: string = 'OK';
    let id: number = 900;

    test.beforeEach(async () => {
        randomizer = new Randomizer();
        randomNumber = randomizer.getRandomNumbers;
        randomName = randomizer.getPetName;
        randomCategory = randomizer.getRandomDepartment
    })

    test('create a pet via POST request', async ({ request }) => {
        await test.step('create a new pet', async () => {
            const petData = {
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

    // test('upload an image directly to an existing pet', async ({ request }) => {
    //     await test.step('upload image for pet', async () => {
    //         const petId = 511;
    //         const imageName: string = 'pug.jpeg'
    //         const imageFilePath = path.join(__dirname, '../../../images', imageName);
    //         const file = fs.readFileSync(imageFilePath);
    //         const formData = new FormData();
    //         formData.append('petId', petId.toString());
    //         formData.append('file', file, {
    //             filename: 'pug.jpeg',
    //             contentType: 'image/jpeg',
    //         });
    //         const response = await request.post(`${baseUrl}/pet/${petId}/uploadImage`, {
    //             headers: {
    //                 'Content-Type': 'form-data',
    //             },
    //             data: formData,
    //         });
    //         console.log(await response.body());
    //         expect(response.status()).toBe(StatusCode.OK);
    //         expect(response.statusText()).toBe(OK);
    //     });
    // })

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
            const res = await request.get(`${baseUrl}/pet/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            expect(res.status()).toBe(StatusCode.OK);
            expect(res.statusText()).toBe(OK);
            expect(await res.json()).toEqual(data);

        })
    })

    test.only('update an existing pet', async ({ request }) => {
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
            "status": "not available"
        }

        await test.step('update an existing pet from previous test', async () => {

            const response = await request.put(`${EndPoints.PET_STORE_BASE_URL}/pet`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: newData,
            })
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('validate the data now matches the new updated data with specific properties', async () => {
            const res = await request.get(`${EndPoints.PET_STORE_BASE_URL}/pet/${id}`, {
            })
            const responseJson: IPet = await res.json();
            expect([responseJson.id, responseJson.name, responseJson.status]).toEqual([newData.id, newData.name, newData.status]);
        })
    })


    test('delete an existing pet', async ({ request }) => {
        await test.step('delete pet with the id from previous test', async () => {
            const response = await request.delete(`${EndPoints.PET_STORE_BASE_URL}/pet/${id}`, {
                headers: {
                    'Content-Type': 'application/json',

                }
            });
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('validate there is no such resource with the deleted id anymore', async () => {
            const res = await request.get(`${baseUrl}/pet/${id}`);
            expect(res.status()).toBe(StatusCode.NOT_FOUND);
        })
    })
})

