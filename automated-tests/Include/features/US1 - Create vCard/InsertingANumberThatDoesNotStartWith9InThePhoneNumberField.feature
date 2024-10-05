Feature: Inserting a number that does not start with 9 in the phone number field
  As a user 
  I want to register in the vCard Mobile application
  So that I can have access to vCard Mobile application features

  Scenario: 
    Given I start the vCard application
    When I insert "123456789" in the phone number field
    And I tap the "Continuar" button
    Then I see the "O número de telemóvel deve começar por 9" error message
