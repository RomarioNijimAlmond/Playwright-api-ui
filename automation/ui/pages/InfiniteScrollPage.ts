import { SchedulerBasePage } from "./SchedulerBasePage";

export class InfiniteScrollPage extends SchedulerBasePage {

    private monthSwitcherLeftArrowLocator = '[aria-label="icon: left"]';
    private monthSwitcherRightArrowLocator = '[aria-label="icon: right"]';
    private monthHeaderLocator = '.header2-text .header2-text-label';
    private calendarComponentLabelLocator = '[class="ant-radio-group ant-radio-group-outline ant-radio-group-default"] label';
    private datePickerMonthYearLabelsLocator = '[class="ant-fullcalendar-header"] label';
    private datePickerYearMonthDropdownSelectorsLocator = '[class="ant-select-selection__rendered"]';
    private schedulerTableContainerLocator = '#RBS-Scheduler-root';
    private timeLineEvent = '.timeline-event';
    private datePickerCalendarBodyLocator = '[class="ant-fullcalendar-calendar-body"]';


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

    public async chooseDateFromDatePicker(options?: { monthOrYearLabel?: string, chooseMonthOrYearLabel?: boolean, chooseYearFromDropdown?: boolean, year?: string, customYear?: string }) {
        const displayedMonth = await this.returnDisplayedMonth();
        const currentMonthAndYear = await this.getCurrentMonthAndYear();
        if (displayedMonth !== currentMonthAndYear) {
            await this.clickElement(this.monthHeaderLocator);
            if (options?.chooseMonthOrYearLabel && options.monthOrYearLabel !== undefined) {
                await this.chooseMonthYearLabel(options.monthOrYearLabel)
            }
            if (options?.chooseYearFromDropdown && options.year !== undefined) {
                await this.chooseYear(options.year, options.customYear);
            }
        } else {
            return;
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

    private async chooseMonthYearLabel(labelName: string, options?: { month?: string, year?: string }) {
        const currentMonth = await this.getCurrentMonth('shortMonthName');
        const currentDay = await this.getCurrentDay();
        const monthYearDatePickerLabel = this.page.locator(this.datePickerMonthYearLabelsLocator, { hasText: labelName });
        await this.clickElement(monthYearDatePickerLabel);
        if (labelName === 'Year' && options?.year !== undefined) {
            await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, options.year);
        } else {
            await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, currentMonth as string);
        } if (labelName === 'Month' && options?.month !== undefined) {
            await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, options.month);
        } else {
            await this.selectValueFromDatePicker(this.datePickerCalendarBodyLocator, currentDay);
        }
    }

    /**
     * @description schedule an event in a specific cell under a specific column in the scheduler calendar if the cube is empty
     * @param column 
     * @param cubeIndex 
     */
    public async scheduleEvent(column: string, cubeIndex: number, alertMessage: string) {
        const calendarCubes: string[] = []
        const tableRow = this.page.locator(`${this.schedulerTableContainerLocator} tbody tr`);
        const tableColumn = await this.getColumnTableIndex(this.schedulerTableContainerLocator, column);
        for (let row of await tableRow.all()) {
            const cubeTableCell = row.locator('td').nth(tableColumn);
            const cubeCellInnerText = await cubeTableCell.innerText();
            if (cubeCellInnerText === '') {
                calendarCubes.push(cubeCellInnerText);
            }
        }
        await this.clickElement(calendarCubes[cubeIndex]);
        await this.alertGetTextAndAccept(alertMessage);
    }

    public async countEventsOnCalendar() {
        const timeLineEvent = this.page.locator(this.timeLineEvent);
        const timeLineCount = await timeLineEvent.count();
        return timeLineCount;
    }

    /**
     * @description clicks on an event in the schedular
     */
    public async clickOnEvent(eventName: string, alertPopupMessage: string) {
        const event = this.page.locator(this.timeLineEvent, { hasText: eventName });
        await this.clickElement(event);
        await this.alertGetTextAndAccept(alertPopupMessage);
    }
}