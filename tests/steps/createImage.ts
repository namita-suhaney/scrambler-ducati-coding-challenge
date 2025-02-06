import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { CommonPage } from "../support/commonPage";
import { ImageCreatePage } from "../support/createImagePage";
const { Given, When, Then } = createBdd();

let imageCreatedPage: string;
let sharedFilePath: string;

When(
  `I fill in the prompt and click {string}`,
  async ({ page }, buttonName) => {
    const imageCreationPage = new ImageCreatePage(page);
    const commonPage = new CommonPage(page);
    await imageCreationPage.fillPrompt("generate an unicorn image");
    await commonPage.buttonNameVisibility(buttonName);
    await commonPage.buttonClick(buttonName);
  }
);

Then("I wait for the generation process to complete", async ({ page }) => {
  const imageCreationPage = new ImageCreatePage(page);
  const commonPage = new CommonPage(page);
  await imageCreationPage.verifyGenerationInProgress();
  // Wait for the element to be visible
  await page
    .getByRole("heading", { name: "PICK YOUR FAVOURITE GENERATIONS" })
    .waitFor({ state: "visible" });
});

Then(
  "I should see the {string} generated images",
  async ({ page }, numberOfImagesGenerated) => {
    const imageCreationPage = new ImageCreatePage(page);
    const commonPage = new CommonPage(page);
    await imageCreationPage.verifyGeneratedImages(numberOfImagesGenerated);
    imageCreatedPage = await commonPage.getCurrentUrl();
  }
);

When("I fill in my details and accept the terms", async ({ page }) => {
  const imageCreationPage = new ImageCreatePage(page);
  await imageCreationPage.enterTheDetails();
});

Then("I should be able to choose one of the 4 images", async ({ page }) => {
  const imageCreationPage = new ImageCreatePage(page);
  await expect(
    page
      .getByRole("paragraph")
      .filter({ hasText: "Pick your favourite Scrambler" })
  ).toBeVisible();
  await imageCreationPage.chooseARandomImage();
  // Download an image
  const downloadPromise = imageCreationPage.downloadImage();
  // Save the downloaded image and verify the image resolution
  const { download, filePath } = await imageCreationPage.saveDownloadedImage(
    downloadPromise
  );
  // Store the filePath in the shared variable
  sharedFilePath = filePath;
});

Then(
  "the resolution of the saved file should be {int} x {int}",
  async ({ page }, expectedWidth, expectedHeight) => {
    const imageCreationPage = new ImageCreatePage(page);
    // Retrieve the filePath from the shared variable
    const filePath = sharedFilePath;
    if (!filePath) {
      throw new Error('File path is not defined');
    }
    const metadata = await imageCreationPage.verifyDownloadedImageResolution(
      filePath
    );
    // Check if the resolution matches the expected values
    expect(metadata.width).toBe(expectedWidth);
    expect(metadata.height).toBe(expectedHeight);
    // Delete the downloaded file to clear the state
    await imageCreationPage.deleteDownloadedImage(filePath);
  }
);
