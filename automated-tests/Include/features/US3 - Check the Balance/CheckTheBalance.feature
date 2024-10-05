Feature: Check The Balance
  As an authenticated user
  I want to check the balance of my vCard 
  So that I can keep track of my available funds and make informed financial decisions.

  Background: 
    Given I start the vCard application

  Scenario: Check the balance with a new vCard
    When I insert "900000000" in the phone number field
    And I tap the "Continuar" button
    Then I see the vCard creation page
    And I insert "abcdefghijk" in the password field
    And I insert "123" in the pin field
    And I tap the "Criar" button
    Then I see the Menu page
    And I see the current balance with value "0.00 €"

  Scenario: Check the balance
    Then I see the Menu page
    And I see the current balance
