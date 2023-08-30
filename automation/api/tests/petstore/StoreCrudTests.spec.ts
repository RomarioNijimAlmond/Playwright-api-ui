import { expect, test } from '@playwright/test'
import Randomizer from '../../../helpers/randomzier/Randomizer';
import { EndPoints } from '../../../common/navigationEnum/EndPoints';
import { StatusCode } from '../../../helpers/apiStatusCodes/StatusCodes';

test.describe('api sanity tests for the pet store', async () => {
    let randomizer: Randomizer;
    let randomNumber: number;
    let randomName: string;
    let randomCategory: string;
    let baseUrl = EndPoints.PET_STORE_BASE_URL;
    let OK: string = 'OK';
    let petId: number = 500;
    let orderId: number = 700;
    let findByStatus: string = 'findByStatus';
    let uploadImage: string = 'uploadImage';
    let store: string = 'store';
    let order: string = 'order';
    let pet: string = 'pet';

    test.beforeEach(async () => {
        randomizer = new Randomizer();
        let randomNumber: number;
        let randomName: string;
        let randomCategory: string;
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })

    test('place order', async ({ request }) => {
        const data = {
            "id": orderId,
            "petId": petId,
            "quantity": 1,
            "status": "placed",
            "complete": true
        }
        await test.step('check if the wanted pet is available first then place an order', async () => {
            const getRequest = await request.get(`${baseUrl}/${pet}/${petId}`);
            const responseJson = await getRequest.json();
            if ('status' in responseJson && responseJson['status'] === 'available') {
                const postRequest = await request.post(`${baseUrl}/${store}/${order}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }, data
                })
                expect(postRequest.status()).toBe(StatusCode.OK);
            } else {
                throw new Error(`the pet you looked for is not available`);
            }
        })
    })

    //---------------------------------------------------------------

    /**
     * @description invalid order should return 400 - it is returning 500 from the server which is a bug in the server side
     */

    test.fixme('place an invalid order', async ({ request }) => {
        await test.step('place an order with invalid details', async () => {
            const response = await request.post(`${baseUrl}/${store}/${order}`, {
                data: {
                    "id": "invalid",
                    "petId": "invalid",
                    "quantity": -1,
                    "status": "invalid-status",
                    "complete": "invalid"
                }
            })
            expect(response.status()).toBe(StatusCode.BAD_REQUEST);
        })

    })

    //---------------------------------------------------------------
    test('get the order details of pet id 500', async ({ request }) => {
        await test.step('retrieve petid 500 data to validate the order is already in the server side', async () => {
            const response = await request.get(`${baseUrl}/${store}/${order}/${orderId}`);
            const responseJson = await response.json();
            expect(responseJson).toEqual({
                "id": orderId,
                "petId": petId,
                "quantity": 1,
                "status": "placed",
                "complete": true
            })
        })
    })

    //---------------------------------------------------------------

    test('get a non existing order', async ({ request }) => {
        await test.step('retrieve an order ID that does not exist and validate there is no such order', async () => {
            const response = await request.get(`${baseUrl}/${store}/${order}/1`);
            expect(response.status()).toBe(StatusCode.NOT_FOUND);
            expect(response.statusText()).toBe('Not Found');
        })
    })

    //---------------------------------------------------------------

    test('modify order with an unallowed method ', async ({ request }) => {
        await test.step('modify order although there is no put method in documentation for this endpoint', async () => {
            const response = await request.put(`${baseUrl}/${store}/${orderId}`, {
                data: {
                    "id": orderId,
                    "petId": petId,
                    "quantity": 1,
                    // "shipDate": formattedDate,
                    "status": "pending",
                    "complete": true
                }
            })
            expect(response.status()).toBe(StatusCode.NOT_FOUND)
        })
    })

    //---------------------------------------------------------------

    test('delete order', async ({ request }) => {
        await test.step('delete order number 700 that was placed earlier', async () => {
            const response = await request.delete(`${baseUrl}/${store}/${order}/${orderId}`);
            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('fetch the same order ID and validate it does not exist', async () => {
            const response = await request.get(`${baseUrl}/${store}/${order}/${orderId}`);
            const responseJson = await response.json();
            expect(responseJson).toEqual({
                "code": 1,
                "type": "error",
                "message": "Order not found"
            })
        })
    })

    //---------------------------------------------------------------
    test('retrieve data from the inventory', async ({ request }) => {
        await test.step('get inventory data from the inventroy endpoint', async () => {
            const response = await request.get(`${baseUrl}/${store}/inventory`);
            const responseJson = await response.json();
            expect(responseJson).toBeDefined();
            expect(response.status()).toBe(StatusCode.OK);
            const propertyCount = Object.keys(responseJson).length;
            const expectedCount = 28;
            expect(propertyCount).toBe(expectedCount);
            expect(responseJson).toHaveProperty('available');
            expect(responseJson).toHaveProperty('Pending');
        })

    })

    //---------------------------------------------------------------


    /**
     * @description the pending pets are not getting increased in the inventory when creating new pets and orders which is a BUG IMO
     */
    test.fixme('validate pet integration with inventory', async ({ request }) => {
        await test.step('get inventory pet available status first', async () => {
            const response = await request.get(`${baseUrl}/${store}/inventory`);
            const responseJson = await response.json();
            expect(responseJson).toHaveProperty('pending', 21);
        })

        await test.step('create new pet in available status', async () => {
            const response = await request.post(`${baseUrl}/${store}/${order}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "id": 7000,
                    "petId": 5000,
                    "quantity": 1,
                    // "shipDate": formattedDate,
                    "status": "pending",
                    "complete": true
                }
            })

            expect(response.status()).toBe(StatusCode.OK);
        })

        await test.step('retrieve the inventory and validate the pending status increased', async () => {
            const response = await request.get(`${baseUrl}/${store}/inventory`);
            const responseJson = await response.json();
            expect(responseJson).toHaveProperty('pending', 22);
        })
    })
})
