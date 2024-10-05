Feature: Inserting non-numeric characters in the phone number field
	As a user who has already created vCard
	I want to access to the application
	So that I can access the features and content that I need

  Scenario: 
    Given I start the vCard application
    When I insert "92222222x" in the phone number field
    And I tap the "Continuar" button
    Then I see the "O número de telemóvel não pode conter caractéres não numéricos" error message
