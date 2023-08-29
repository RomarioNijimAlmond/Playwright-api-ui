import { Locator, Page } from "@playwright/test";
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
        const tableData = table.locator('tbody td');
        const spanValues = tableData.locator('span', { hasText: value })
        await this.clickElement(spanValues);
}

    
}