import { Locator, Page, expect } from "@playwright/test";
import { ApplicationUrl } from "../../common/navigationEnum/ApplicationUrl";
export class BasePage {

    constructor(public page: Page) {
        this.page = page
    }

    public async loadApplication(url: ApplicationUrl) {
        await this.page.goto(url.valueOf(), {
            waitUntil: 'domcontentloaded',
        });
    }

    public async fillText(element: (string | Locator), text: string) {
        const locatorElement = element as Locator;

        if (typeof element === 'string') {
            await this.page.locator(element).click();
            await this.page.locator(element).fill(text);
        }
        else if (element === locatorElement) {
            await element.click();
            await element.fill(text);
        }
    }

    public async clickElement(element: (string | Locator | undefined)) {
        const locatorElement = element as Locator;
        if (typeof element === 'string') {
            await this.page.locator(element).click({ force: true });
        }
        else if (element === locatorElement) {
            await element.click({ force: true });
        }
    }

    /**
     * @description applies to choosing months and years from a date picker
     * @param dateTableLocator 
     * @param value 
     */
    protected async selectValueFromDatePicker(dateTableLocator: string, value: string) {
        const table = this.page.locator(dateTableLocator);
        const tableData = table.locator('tbody tr');
        const tdValues = tableData.locator('td', { hasText: value })
        await this.clickElement(tdValues);
    }

    public async alertGetTextAndAccept(text: string) {
        this.page.on('dialog', async (dialog) => {
            const message = dialog.message();
            await this.waitForVisiblityOfElement(message);
            if (message.trim().includes(text)) {
                expect(message).toContain(text);
                await dialog.accept();
            } else {
                throw new Error(`the actual alert text does not contain the expected alert text`);
            }
        });
    }

    public async alertGetTextAndDismiss(text: string) {
        this.page.on('dialog', async (dialog) => {
            const message = dialog.message();
            await this.waitForVisiblityOfElement(message);
            if (message.trim().includes(text)) {
                expect(message).toContain(text);
                await dialog.dismiss();
            } else {
                throw new Error(`the actual alert text does not contain the expected alert text`);
            }
        });
    }

    public async waitForVisiblityOfElement(element: (string | Locator), visibilityTimeout?: number) {
        const elementLocator = element as Locator;
        if (typeof element === 'string') {
            const domLocator = this.page.locator(element);
            await domLocator.waitFor({ state: "visible", timeout: visibilityTimeout });
        } else if (element === elementLocator) {
            await element.waitFor({ state: "visible" });
        }

    }

    public async waitForInvisibiltyOfElement(element: (string | Locator)) {
        const elementLocator = element as Locator;
        if (typeof element === 'string') {
            const domLocator = this.page.locator(element);
            await domLocator.waitFor({ state: "hidden" });
        } else if (element === elementLocator) {
            await element.waitFor({ state: "hidden" });
        }
    }

    public async hover(locator: (string | Locator)) {
        const element = locator as Locator
        if (typeof locator === 'string') {
            await this.page.locator(locator).hover();
        } else if (locator === element) {
            await element.hover();
        } else {
            return null;
        }
    }

    public async alertAccept() {
        this.page.on('dialog', async (dialog) => await dialog.accept());
    }

    public async alertDismiss() {
        this.page.on('dialog', dialog => {
            dialog.dismiss();
        });
    }

    public async alertGetText() {
        this.page.on('dialog', dialog => {
            dialog.message();
        });
    }

    public async getCurrentMonth(monthNaming: string) {
        let month = new Date();
        switch (monthNaming) {
            case 'fullMonthName':
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const monthString = monthNames[month.getMonth()];
                return monthString;
            case 'shortMonthName':
                const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthStr = monthName[month.getMonth()];
                return monthStr;
        }
    }

    public async getCurrentYear() {
        let year = new Date();
        let currentYear: string = `${year.getFullYear()}`;
        return currentYear;
    }

     public async getCurrentDay() {
        let day = new Date();
        let currentDay: string = `${(day.getDate())}`;
        return currentDay;
    }

    public async clickAndChooseFromDropdownByText(elementLocator: string, text: string) {
        const locatorList = await this.page.locator(elementLocator).all();
        for (let element of locatorList) {
            const elementInnerText = await element.innerText();
            if (elementInnerText === text) {
                await element.click();
                break;
            }
        }
    }

    public async getCurrentUrl() {
        const title = this.page.url();
        return title;
    }

    public async dragAndDrop(source: (string | Locator), target: (string | Locator)) {
        const sourceElement = source as Locator;
        const targetElement = target as Locator;
        if (typeof source === 'string' && typeof target === 'string') {
            await this.page.locator(source).dragTo(this.page.locator(target))
        } else if (source === sourceElement && target === targetElement) {
            await source.dragTo(target);
        }
    }

    public async getCurrentMonthAndYear() {
        const currentMonth = await this.getCurrentMonth('fullMonthName');
        const currentYear = await this.getCurrentYear();
        const currentMonthAndYear = `${currentMonth} ${currentYear}`;
        return currentMonthAndYear;
    }
}