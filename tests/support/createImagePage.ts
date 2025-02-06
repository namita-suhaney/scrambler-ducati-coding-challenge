import { expect, Locator, Page } from "@playwright/test";
import sharp from "sharp";
import { CommonPage } from "./commonPage";
import * as fs from "fs";

export class ImageCreatePage {
  promptTextbox: Locator;
  progressSpinner: Locator;
  progressSpinnerText: Locator;
  generateImages: Locator;
  firstName: Locator;
  lastName: Locator;
  emailAddress: Locator;
  selectCountryDropdown: Locator;
  termsAndConditionCheckbox: Locator;
  submitButton: Locator;
  thankYouText: Locator;
  nextButton: Locator;
  downloadButton: Locator;
  public currentTime: number;
  public browserName: string;
  commonPage: CommonPage;

  constructor(private page: Page) {
    this.page = page;
    this.commonPage = new CommonPage(page);
    this.currentTime = Date.now();
    this.browserName = this.page.context().browser()?.browserType().name() || 'unknown';
    this.promptTextbox = page.getByRole("textbox", {
      name: "Scrambler Ducati [Insert your description here]",
    });
    this.progressSpinner = page.getByRole("img", {
      name: "Spinning animated Scrambler",
    });
    this.generateImages = page.getByRole("button", { name: "generated image" });
    this.progressSpinnerText = page.getByRole("heading", {
      name: "Your Generation is in progress. It may take up to a minute.",
    });
    this.firstName = page.getByRole("textbox", { name: "First Name" }),
    this.lastName = page.getByRole("textbox", { name: "Last Name" }),
    this.emailAddress = page.getByRole("textbox", { name: "Email" }),
    this.selectCountryDropdown = page.getByRole("combobox", { name: "Select Country"}),
    this.termsAndConditionCheckbox = page.getByRole("checkbox", { name: "to understand your"}),
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.thankYouText = page.getByRole("heading", { name: "Thank you!" });
    this.nextButton = page.getByRole("button", { name: "Next" });
    this.downloadButton = page.getByRole("button", { name: "DOWNLOAD" });
  }
  
  async verifyCreateLinkVisible() {
    await expect(this.page.getByRole("link", { name: "Create" })).toBeVisible();
  }

  async fillPrompt(promptText: string) {
    await expect(this.promptTextbox).toBeVisible();
    await this.promptTextbox.click();
    await this.promptTextbox.fill(promptText);
  }

  async verifyGenerationInProgress() {
    await expect(this.progressSpinner).toBeVisible();
    await this.progressSpinnerText.waitFor({ state: "visible" });
  }

  // Wait for the progress spinner to be hidden
  async waitForProgressSpinnerToFinish() {
    await this.progressSpinner.waitFor({ state: "hidden" });
  }

  async verifyGeneratedImages(numberOfImages: string) {
    await expect(this.generateImages).toHaveCount(parseInt(numberOfImages));
    for (let i = 0; i < parseInt(numberOfImages); i++) {
      const generatedImageButton = this.page
        .getByRole("button", { name: "generated image" })
        .nth(i);
      await expect(generatedImageButton).toBeVisible();
      // Locates the img element from generatedImageButton
      const image = generatedImageButton.locator("img");
      //  To verify that each image element is visible on the page
      // but may not be completely loaded
      await expect(image).toBeVisible();
      // To verify that each image is completely loaded
      await image.evaluate(async (img: HTMLImageElement) => {
        //Check if this timeout can be increased and try to reduce the rety to 3
        for (let retries = 0; retries < 3; retries++) {
          if (img.complete) {
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        throw new Error("Image not fully loaded");
      });
    }
  }

  async enterTheDetails() {
    await expect(this.firstName).toBeVisible();
    await this.firstName.click();
    await this.firstName.fill("Namita");
    await this.lastName.click();
    await this.lastName.fill("Suhaney");
    await this.emailAddress.click();
    await this.emailAddress.fill("namita.suhaney@gmail.com");
    await this.selectCountryDropdown.click();
    await this.page.getByLabel("Australia").getByText("Australia").click();
    await this.termsAndConditionCheckbox.click();
  }

  async chooseARandomImage() {
    const randomGeneratedIndex = await this.commonPage.generateRandomIndex(4);
    await expect(
      this.page
        .getByRole("button", { name: "generated image" })
        .nth(randomGeneratedIndex)
    ).toBeVisible();
    console.log(`Select the random generated image# ${randomGeneratedIndex}`);
    await this.page
      .getByRole("button", { name: "generated image" })
      .nth(randomGeneratedIndex)
      .click({ force: true });
    await this.nextButton.click();
    await expect(this.downloadButton).toBeVisible();
  }

  async downloadImage() {
    const downloadPromise = this.page.waitForEvent("download");
    await expect(this.downloadButton).toBeVisible();
    await this.downloadButton.click();
    //Download button is clicked
    return downloadPromise;
  }

  async saveDownloadedImage(downloadPromise: Promise<any>) {
    const download = await downloadPromise;
    // Save the downloaded file to a specific path
    const filePath = `./tests/downloadedImage-${this.browserName}-${this.currentTime}.jpeg`;
    await download.saveAs(filePath);
    return { download, filePath };
  }

  async verifyDownloadedImageResolution(filePath: string) {
    // Verify the resolution of the downloaded image
    const image = sharp(filePath);
    const metadata = await image.metadata();
    console.log(
      `Image width: ${metadata.width}, Image height: ${metadata.height}`
    );
    return metadata;
  }

  async deleteDownloadedImage(filePath: string) {
    // Delete the downloaded image
    fs.unlinkSync(filePath);
  }
}
