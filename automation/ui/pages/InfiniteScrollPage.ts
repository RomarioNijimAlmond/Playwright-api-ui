import { SchedulerBasePage } from "./SchedulerBasePage";

export class InfiniteScrollPage extends SchedulerBasePage {

    private monthSwitcherLeftArrowLocator = '[aria-label="icon: left"]';
    private monthSwitcherRightArrowLocator = '[aria-label="icon: right"]';
    private monthHeaderLocator = '.header2-text .header2-text-label';
    private calendarComponentLabelLocator = '[class="ant-radio-group ant-radio-group-outline ant-radio-group-default"] label';
    private datePickerMonthYearLabelsLocator = '[class="ant-fullcalendar-header"] label';
    private datePickerYearMonthDropdownSelectorsLocator = '[class="ant-select-selection__rendered"]';


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
        const currentMonth = await this.getCurrentMonth();
        const currentYear = await this.getCurrentYear();
        const currentMonthAndYear = `${currentMonth} ${currentYear}`;
        const displayedMonth = await this.returnDisplayedMonth();
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

    private async chooseMonthYearLabel(labelName: string) {
        const monthYearDatePickerLabel = this.page.locator(this.datePickerMonthYearLabelsLocator, { hasText: labelName });
        await this.clickElement(monthYearDatePickerLabel);
    }
}