import { expect, Page } from "@playwright/test";

export class CommonPage {
  constructor(public page: Page) {}

  async goTo(path: string = "") {
    //To use the relative path
    await this.page.goto(path);
    // Can segregate the method to accept the cookies
    await this.page.getByRole("button", { name: "Accept All Cookies" }).click();
  }

  async linkVisibility(linkName: string) {
    await expect(this.page.getByRole("link", { name: linkName })).toBeVisible();
  }

  async linkClick(linkName: string) {
    await this.page.getByRole("link", { name: linkName }).click();
  }

  async buttonNameVisibility(buttonName: string) {
    await expect(
      this.page.getByRole("button", { name: buttonName, exact: true })
    ).toBeVisible();
  }

  async buttonClick(buttonName: string) {
    await this.page
      .getByRole("button", { name: buttonName, exact: true })
      .click();
  }

  async verifyPageTitle(pageName: string) {
    await expect(
      this.page.getByRole("heading", { name: pageName })
    ).toBeVisible();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async verifyUrl(expectedUrl: string) {
    const currentUrl = await this.getCurrentUrl();
    console.log("Current URL: ", currentUrl);
    expect(currentUrl).toBe(expectedUrl);
  }

  async getBrowserName({ browser })  {
    // Getting the browser name from the `browser` object
    const browserName = browser.options.name;
    console.log(`Test is running on ${browserName}`);
    return browserName;
  }

  // Can put this in the helper file
  // Generate a random index
  async generateRandomIndex(length: number) {
    const randomIndex = Math.floor(Math.random() * length);
    return randomIndex;
  }
}
