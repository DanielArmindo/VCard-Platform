Feature: Check the list of transactions
  As an authenticated user,
  I want to see a list of my transactions,
  So that i can track and review my financial activity over a specific period

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page

  Scenario: Check empty list of transactions
    Then I tap the "Lista de transações" button
    And I see the "Transações" page
    And I see "Ainda não fez nenhuma transação" information message

  Scenario: Check transaction from the list of transactions
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "5" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Menu" page
    And I see "Transação efetuada" information message
    Then I tap the "Lista de transações" button
    And I see the "Transações" page
    Then I see my transaction list
