Feature: Inserting non-numeric characters in the phone number field
  As a user 
  I want to register in the vCard Mobile application
  So that I can have access to vCard Mobile application features

  Scenario: 
    Given I start the vCard application
    When I insert "91234567x" in the phone number field
    And I tap the "Continuar" button
    Then I see the "O número de telemóvel não pode conter caractéres não numéricos" error message
