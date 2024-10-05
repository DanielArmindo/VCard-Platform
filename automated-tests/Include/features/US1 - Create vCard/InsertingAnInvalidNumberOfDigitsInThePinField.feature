Feature: Inserting an invalid number of digits in the pin field
  As a user 
  I want to register in the vCard Mobile application
  So that I can have access to vCard Mobile application features

  Background: 
    Given I start the vCard application

  Scenario Outline: 
    When I insert "900000000" in the phone number field
    And I tap the "Continuar" button
    Then I see the vCard creation page
    And I insert "abcdefghijk" in the password field
    And I insert <pin> in the pin field
    And I tap the "Criar" button
    Then I see the "O pin deve ter 3 dígitos" error message

    Examples: 
      | pin    |
      | "12"   |
      | "1234" |
