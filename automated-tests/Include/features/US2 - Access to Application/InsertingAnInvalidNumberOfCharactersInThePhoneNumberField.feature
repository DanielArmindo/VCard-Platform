Feature: Inserting an invalid number of characters in the phone number
	As a user who has already created vCard
	I want to access to the application
	So that I can access the features and content that I need

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
