import { Locator } from "playwright";
import { SchedulerBasePage } from "./SchedulerBasePage";
import { expect } from "@playwright/test";

export class InfiniteScrollPage extends SchedulerBasePage {

    private monthSwitcherLeftArrowLocator = '[aria-label="icon: left"]';
    private monthSwitcherRightArrowLocator = '[aria-label="icon: right"]';
    private monthHeaderLocator = '.header2-text .header2-text-label';
    private calendarComponentLabelLocator = '[class="ant-radio-group ant-radio-group-outline ant-radio-group-default"] label';
    private datePickerMonthYearLabelsLocator = '[class="ant-fullcalendar-header"] label';
    private datePickerYearMonthDropdownSelectorsLocator = '[class="ant-select-selection__rendered"]';
    private schedulerTableContainerLocator = '.scheduler';
    private timeLineEvent = '.timeline-event';
    private datePickerCalendarBodyLocator = '[class="ant-fullcalendar-calendar-body"]';
    private timeLineEvenPopupBox = '[class="ant-popover ant-popover-placement-bottomLeft"]';


    public async chooseMonthByClickingOnTheArrows(arrow: string) {
        switch (arrow) {
            case 'left':
                await this.clickElement(this.monthSwitcherLeftArrowLocator);
                break;
            case 'right':
                await this.clickElement(this.monthSwitcherRightArrowLocator);
                break;
        }
    }

    /**
     * @description return the displayed month on your left side when first entering the infinite scroll screen
     * @returns the month innerText
     */
    public async returnDisplayedMonth() {
        const monthInnerText = await this.page.locator(this.monthHeaderLocator).innerText();
        return monthInnerText.trim();
    }

    /**
     * @description choose day or month
     */
    public async chooseDateComponent(label: string) {
        const calendarComponent = this.page.locator(this.calendarComponentLabelLocator, { hasText: label });
        await this.clickElement(calendarComponent);
    }

    public async chooseDateFromDatePicker(options?: { monthOrYearLabel?: string, chooseMonthOrYearLabel?: boolean, chooseYearFromDropdown?: boolean, month?: string, customMonth?: string }) {
        await this.clickElement(this.monthHeaderLocator);
        if (options?.chooseMonthOrYearLabel && options.monthOrYearLabel !== undefined) {
            await this.chooseMonthYearLabel(options.monthOrYearLabel, { month: options.month })
        }
        if (options?.chooseYearFromDropdown && options.month !== undefined) {
            await this.chooseYear(options.month, options.customMonth);
        }
    }

    private async chooseYear(year: string, customYear?: string) {
        const currentYear = await this.getCurrentYear();
        const yearDropdownLocator = this.page.locator(this.datePickerYearMonthDropdownSelectorsLocator, { hasText: year })
        if (customYear !== undefined) {
            await this.clickElement(yearDropdownLocator);
            const yearOptionsList = this.page.getByRole('listbox').locator('li', { hasText: customYear });
            await this.clickElement(yearOptionsList);
        } else {
            await this.clickElement(yearDropdownLocator);
            await this.clickElement(currentYear);
        }
    }

    private async chooseMonthYearLabel(labelName: string, options?: { day?: string, month?: string }) {
        const currentMonth = await this.getCurrentMonthName('shortMonthName');
        const currentDay = await this.getCurrentDay();
        const monthYearDatePickerLabel = this.page.locator(this.datePickerMonthYearLabelsLocator, { hasText: labelName });
        await this.clickElement(monthYearDatePickerLabel);
        switch (labelName) {
            case 'Year':
                if (options?.month !== undefined) {
                    await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, options.month);
                } else {
                    await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, currentMonth as string);
                }
                break;
            case 'Month':
                if (options?.day !== undefined) {
                    await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, options.day);
                } else {
                    await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, currentDay);
                }
                break;
        }
    }

    /**
     * @description schedule an event in a specific cell under a specific column in the scheduler calendar if the cube is empty
     * @param column 
     * @param tdIndex 
     */
    public async scheduleEvent(rowText: string, column: string, alertMessage: string) {
        const tableRow = this.page.locator(`${this.schedulerTableContainerLocator} tbody tr`, { hasText: rowText });
        const tableColumn = await this.getColumnTableIndex(this.schedulerTableContainerLocator, column);
        const tableCell = tableRow.locator('td').nth(tableColumn);
        const cellInnerText = await tableCell.innerText();
        if (cellInnerText === '') {
            await this.scrollIntoViewIfNeeded(tableCell);
            await this.chooseDateFromDatePicker({ chooseMonthOrYearLabel: true, monthOrYearLabel: 'Year' });
            await this.scrollIntoViewIfNeeded(tableCell);
            await tableCell.focus();
            try {
                await this.clickElement(tableCell);
                await this.alertGetTextAndAccept(alertMessage);
            } catch (error) {
                throw new Error('clicking to create an event failed');
            }
        }
    }

    public async countEventsOnSchedular() {
        const timeLineEvent = this.page.locator(this.timeLineEvent);
        const timeLineCount = await timeLineEvent.count();
        return timeLineCount;
    }

    public async countEventsWithSpecificText(eventName: string) {
        const eventArr: Locator[] = [];
        const timeLineEvent = await this.page.locator(this.timeLineEvent, { hasText: eventName }).all();
        for (const event of timeLineEvent) {
            const eventInnerText = await event.innerText();
            if (eventInnerText.includes(eventName)) {
                eventArr.push(event);
            }
        }
        return eventArr.length;
    }

    public async checkIfEventsExistOnCalendar(event: string, expectedEventNumber: number) {
        const eventsName = await this.countEventsWithSpecificText(event);
        if (eventsName !== expectedEventNumber) {
            throw new Error(`the events with the name ${event} that you are looking for does not match the expected event number ${expectedEventNumber}`)
        } else {
            return eventsName;
        }
    }

    /**
     * @description clicks on an event in the schedular
     */
    public async clickOnEvent(eventName: string, alertPopupMessage: string) {
        const event = this.page.locator(this.timeLineEvent, { hasText: eventName });
        await this.clickElement(event);
        await this.alertGetTextAndAccept(alertPopupMessage);
    }

    public async hoverOnEvent(eventName: string, eventIndex: number) {
        const event = this.page.locator(this.timeLineEvent, { hasText: eventName });
        const indexOfEvent = event.nth(eventIndex);
        await this.hover(indexOfEvent);
        const timeLineEventPopup = this.page.locator(this.timeLineEvenPopupBox)
        await this.waitForVisiblityOfElement(timeLineEventPopup);
        return (await timeLineEventPopup.innerText()).trim();
    }
}