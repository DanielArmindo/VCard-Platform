Feature: Access to Application
  As a user who has already created vCard
  I want to access to the application
  So that I can access the features and content that I need

  Scenario: 
    Given I start the vCard application
    When I insert "922222222" in the phone number field
    And I tap the "Continuar" button
    Then I see the vCard authentication page
    And I insert "password" in the password field
    And I tap the "Entrar" button
    Then I see the Menu page
    Then I close the vCard application
    And I start the vCard application
    Then I see the Menu page
