# Ducati Scrambler Image Generation E2E Tests

This project contains end-to-end (E2E) tests for the Ducati Scrambler image generation feature using Playwright and Cucumber.

## Table of Contents

- Project Structure
- Installation
- Running Tests
- Configuration
- Report
- README.md

## Project Structure

- `tests/features/`: Contains the feature files written in Gherkin syntax.
- `tests/steps/`: Contains the step definitions for the feature files.
- `tests/support/`: Contains the page object models and support files.
- `playwright.config.ts`: Configuration file for Playwright.
- `package.json`: Contains the project dependencies.
- `README.md`: This file.

## Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/namita-suhaney/ducatiScrambler.git
   cd ducatiScrambler

2. npm install

3. To install Playwright: npm install playwright --save-dev
  Or alternatively download `Playwright Test for VSCode` from VS Code Marketplace and install it from the command panel by typing and selecting:
  `Install Playwright`

4. To install Cucumber: npm i @cucumber/cucumber -D
5. To run BDD tests with Playwright runner: npm i playwright-bdd


 ## Running Tests

 Tests can be run manually from within the `ducatiScrambler-e2e-tests` directory using the following command:

1. To run the tests in headless mode: `npx bddgen && npx playwright test`
2. To run the tests in headed mode: `npx bddgen && npx playwright test --headed`
3. To run the tests in UI mode: `npx bddgen && npx playwright test --ui`

 ## Configuration

The Playwright configuration is defined in playwright.config.ts. You can set various options such as the base URL, timeout, and reporter.

## Report

index.html report can be found in the `ducatiScrambler-e2e-tests/playwright-report` directory.

This `README.md` file provides a comprehensive overview of your project and instructions on how to set it up and run the tests.
