Feature: Inserting an invalid number of characters in the phone number
  As a user 
  I want to register in the vCard Mobile application
  So that I can have access to vCard Mobile application features

  Background: 
    Given I start the vCard application

  Scenario Outline: Inserting an invalid number of characters in the phone number
    When I insert <phonenumber> in the phone number field
    And I tap the "Continuar" button
    Then I see the "O número de telemóvel tem de ter 9 dígitos" error message

    Examples: 
      | phonenumber  |
      | '933'        |
      | '9222222222' |
