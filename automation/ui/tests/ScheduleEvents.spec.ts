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
    let cubeColumnIndex: number = 8;
    let short: string = 'short';
    let alertSchedulerCreationMessage: string = 'Do you want to create a new event?'.trim();
    let alertClickOnEventMessage: string = 'You just clicked an event'.trim();
    let newEventYouJustCreated: string = 'New event you just created'.trim();
    let recurringEventCaption: string = 'R1 has recurring tasks every week on Tuesday, Friday'.trim();
    let resource2: string = 'Resource2';
    let resource4: string = 'Resource4';

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
        const CurrentMonth = await basePage.getCurrentMonth();
        const CurrentDay = await basePage.getCurrentDay();
        const CurrentDayName = await basePage.getCurrentDayName(short);
        const currentDaySchedulerColumn = `${CurrentDayName} ${CurrentDay}/${CurrentMonth}`;

        await test.step('click on infinite scroll link', async () => {
            await schedulerBasePage.chooseSchedulerLinkOption(linkName)
            const currentUrl = await basePage.getCurrentUrl();
            expect(currentUrl).toContain(infiniteScroll);
        })

        await test.step('choose the month label component', async () => {
            await infiniteScrollPage.chooseDateComponent(monthLabel);
        })

        //BUG-there is a reproducible bug here - when choosing a date for the first time it automatically displays october even though I did not choose october
        await test.step('choose the current month on the scheduler', async () => {
            await infiniteScrollPage.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: yearLabel });
            //choose date again to get the correct fate as a workaround for now
            await infiniteScrollPage.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: yearLabel });
            const displayedMonth = await infiniteScrollPage.returnDisplayedMonth();
            const currentMonthAndYear = await basePage.getCurrentMonthAndYear();
            expect(displayedMonth).toBe(currentMonthAndYear);
        })

        await test.step('count timeline events before adding new events', async () => {
            const timeLineEvents = await infiniteScrollPage.countEventsOnSchedular();
            expect(timeLineEvents).toBe(9);
        })


        await test.step('add a new event ', async () => {
            await infiniteScrollPage.scheduleEvent(resource2, currentDaySchedulerColumn, alertSchedulerCreationMessage);
        })

        await test.step('hover on one of the events and observe popup content', async () => {
            await infiniteScrollPage.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: yearLabel });
            const eventPopup = await infiniteScrollPage.hoverOnEvent(recurringEventCaption, 1);
            expect(eventPopup).toContain(recurringEventCaption);
        })

        await test.step('validate timeline events increased after adding an event', async () => {
            const timeLineEvents = await infiniteScrollPage.countEventsOnSchedular();
            expect(timeLineEvents).toBe(10);
        })

        await test.step('go one month ahead and validate the number of elements decreases', async () => {
            await infiniteScrollPage.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: yearLabel, month: 'Oct' });
            const displayedDate = await infiniteScrollPage.returnDisplayedMonth();
            expect(displayedDate).toContain('October');
            const timeLineEvents = await infiniteScrollPage.countEventsOnSchedular();
            expect(timeLineEvents).toBe(9);
        })

        await test.step('return to the original month and validate the events you created still exist', async () => {
            await infiniteScrollPage.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: yearLabel });
            const createdEvent = await infiniteScrollPage.countEventsWithSpecificText(newEventYouJustCreated);
            expect(createdEvent).toBe(1);
        })
    })
})