import { expect } from "@playwright/test";
import { createBdd } from "playwright-bdd";
import { CommonPage } from "../support/commonPage";
import { ImageCreatePage } from "../support/createImagePage";
const { Given, When, Then } = createBdd();

Given("I am on the Ducati Scrambler website", async ({ page }) => {
  const commonPage = new CommonPage(page);
  await commonPage.goTo();
  await expect(
    page.getByRole("heading", {
      name: "Scrambler Ducati meets Artificial Intelligence",
    })
  ).toBeVisible();
});

When("I click {string} link", async ({ page }, linkName) => {
  const commonPage = new CommonPage(page);
  await commonPage.linkVisibility(linkName);
  await commonPage.linkClick(linkName);
});

// Can be made more generic by passing the assertion text as a parameter
When("I click {string} button", async ({ page }, buttonName) => {
  const commonPage = new CommonPage(page);
  const imageCreationPage = new ImageCreatePage(page);
  const thankYouText = imageCreationPage.thankYouText;
  await commonPage.buttonNameVisibility(buttonName);
  await commonPage.buttonClick(buttonName);
  await expect(thankYouText).toBeVisible();
});

Then("I should see the {string} page title", async ({ page }, pageName) => {
  const commonPage = new CommonPage(page);
  await commonPage.verifyPageTitle(pageName);
});
