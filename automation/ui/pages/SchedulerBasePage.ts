import { BasePage } from "./BasePage";

export class SchedulerBasePage extends BasePage {
    private schedularLinkOptions = '#root a';

    public async chooseSchedulerLinkOption(linkName: string) {
        await this.clickAndChooseFromDropdownByText(this.schedularLinkOptions, linkName);
    }

    public async getColumnTableIndex(tableRowLocator: string, column: string) {
        const columnHeaders = await this.page.locator(`${tableRowLocator} thead th`).all();
        for (let i = 0; i < columnHeaders.length; i++) {
            if (await columnHeaders[i].innerText() === column) {
                return i;
            }
        }
        throw new Error(`The expected column "${column}" for the following table locator: "${tableRowLocator}" is not found`);
    }

}