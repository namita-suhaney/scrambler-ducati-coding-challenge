Feature: To verify the text to image feature

    As a Scramble Ducati customer
    I want to verify the text to image converter

Background:
    Given I am on the Ducati Scrambler website
    And I click "Start to Create" link
    And I should see the "Create Your Custom Scrambler Ducati" page title

    Scenario: Generate image with text
    When I fill in the prompt and click "Generate"
    And I wait for the generation process to complete
    Then I should see the "4" generated images
    And I fill in my details and accept the terms
    And I click "Submit" button
    And I should be able to choose one of the 4 images
    And the resolution of the saved file should be 2056 x 1368