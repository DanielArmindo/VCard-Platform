Feature: Access to Application
	As a user who has already created vCard,
	I want to access to the application,
	So that I can access the features and content that I need

	Background:
		Given I start the vCard application

  Scenario Outline: Inserting a number that does not start with 9
		When I insert <phonenumber> in the phone number field
		And I tap the "Continuar" button
		Then I see the "O número de telemóvel deve começar por 9" error message

    Examples:
      | phonenumber |
      | "123456789" |