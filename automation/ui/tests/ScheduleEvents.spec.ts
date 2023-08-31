import { expect, test } from '@playwright/test'
import { BasePage } from '../pages/BasePage'
import { ApplicationUrl } from '../../common/navigationEnum/ApplicationUrl';
import { SchedulerBasePage } from '../pages/SchedulerBasePage';
import { InfiniteScrollPage } from '../pages/InfiniteScrollPage';


test.describe('test', async () => {
    let basePage: BasePage;
    let schedulerBasePage: SchedulerBasePage;
    let infiniteScrollPage: InfiniteScrollPage;
    let linkName: string = 'Infinite scroll';
    let infiniteScroll: string = 'infinitescroll';
    let yearLabel: string = 'Year';
    let monthLabel: string = 'Month';

    test.beforeEach(async ({ page }) => {
        basePage = new BasePage(page);
        schedulerBasePage = new SchedulerBasePage(page);
        infiniteScrollPage = new InfiniteScrollPage(page);
        await test.step('load application and go to the schedular website', async () => {
            await basePage.loadApplication(ApplicationUrl.SCHEDULER_WEB_APP);
        })
    })

    test.afterEach(async ({ context }) => {
        await context.clearCookies();
    })


    test('add events and test the functionality of the calendar schedular', async () => {
        await test.step('click on infinite scroll link', async () => {
            await schedulerBasePage.chooseSchedulerLinkOption(linkName)
            const currentUrl = await basePage.getCurrentUrl();
            expect(currentUrl).toContain(infiniteScroll);
        })

        await test.step('choose the month label component', async () => {
            await infiniteScrollPage.chooseDateComponent(monthLabel);
        })

        await test.step('choose the current month on the scheduler', async () => {
            await infiniteScrollPage.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: yearLabel });
            const displayedMonth = await infiniteScrollPage.returnDisplayedMonth();
            const currentMonthAndYear = await basePage.getCurrentMonthAndYear();
            // expect(displayedMonth).toBe(currentMonthAndYear);
        })

        // await test.step('schedule an event', async() => {
        //     await infiniteScrollPage.scheduleEvent()
        // })
    })
})