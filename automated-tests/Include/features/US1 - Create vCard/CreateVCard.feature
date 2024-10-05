Feature: Create vCard
  As a user 
  I want to register in the vCard Mobile application
  So that I can have access to vCard Mobile application features

  Scenario: 
    Given I start the vCard application
    When I insert "900000000" in the phone number field
    And I tap the "Continuar" button
    Then I see the vCard creation page
    And I insert "abcdefghijk" in the password field
    And I insert "123" in the pin field
    And I tap the "Criar" button
    Then I see the Menu page
