import { expect, test } from "@playwright/test";
import { EndPoints } from "../../../common/navigationEnum/EndPoints";
import { IPet } from "../../../interfaces/PerInterfaces";
import { StatusCode } from "../../../helpers/apiStatusCodes/StatusCodes";

test.describe('sanity api tests for the pet store api', async () => {
    let baseUrl = EndPoints.PET_STORE_BASE_URL;

    test.only('create a pet via post request', async ({ request }) => {
        await test.step('create a new pet', async () => {
            const petData = {
                "id": 500,
                "category": {
                    "id": 656,
                    "name": "dog category"
                },
                "name": "pooki",
                "photoUrls": [
                    "https://ibb.co/jM49Hrv"
                ],
                "tags": [
                    {
                        "id": 500,
                        "name": "random-tag"
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
        })
    })

    // test('retrieve pet data', async ({ request }) => {
    //     await test.step('retrieve pet data', async () => {
    //         response = await res
    //     })
    // })
})
