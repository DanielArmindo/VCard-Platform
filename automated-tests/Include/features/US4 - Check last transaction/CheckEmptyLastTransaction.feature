Feature: Check last Transaction
  As an authenticated user 
  I want to check the details of my last transaction on my virtual card 
  So I can verify recent activity and ensure the accuracy of my financial records.

  Scenario: Check empty last transaction
    Given I start the vCard application
    When I insert "900000000" in the phone number field
    And I tap the "Continuar" button
    Then I see the vCard creation page
    And I insert "abcdefghijk" in the password field
    And I insert "123" in the pin field
    And I tap the "Criar" button
    Then I see the Menu page
    Then I see "Ainda não fez nenhuma transação" information message in the last transaction element
