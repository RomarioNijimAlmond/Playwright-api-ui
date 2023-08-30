import { BasePage } from "./BasePage";

export class SchedulerBasePage extends BasePage {


    public async chooseSchedulerLinkOption(linkName: string) {
        const linkLocator = this.page.getByRole("link", { name: linkName });
        await this.clickElement(linkLocator);
    }

    public async getColumnTableIndex(tableRowLocator: string, column: string) {
        const columnHeaders = await this.page.$$(`${tableRowLocator} thead th`);
        for (let i = 0; i < columnHeaders.length; i++) {
            if (await columnHeaders[i].innerText() === column) {
                return i;
            }
        }
        throw new Error(`The expected column "${column}" for the following table locator: "${tableRowLocator}" is not found`);
    }

    public async clickAndChooseFromDropdownByText( elementLocator: string, text: string) {
        const locatorList = await this.page.locator(elementLocator).all();
        for (let element of locatorList) {
            const elementInnerText = await element.innerText();
            if (elementInnerText === text) {
                await element.click();
                return;
            } else {
                throw new Error(`the item with the text ${text} is not found in the list`);
            }
        }
    }

}