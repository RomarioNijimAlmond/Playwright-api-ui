import {test} from '@playwright/test'
import { BasePage } from '../pages/BasePage'
import { ApplicationUrl } from '../../common/navigationEnum/ApplicationUrl';


test.describe('test', async() => {
    let basePage:BasePage;

    test.beforeEach(async({page}) => {
        basePage = new BasePage(page);
    })

    test.afterEach(async({context}) => {
        await context.clearCookies();
    })

   

})