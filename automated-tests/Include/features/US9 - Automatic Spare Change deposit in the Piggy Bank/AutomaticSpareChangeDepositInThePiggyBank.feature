Feature: As an authenticated user,
  I want to be able to enable the Spare Change feature,
  So that the spare change from my transactions is automatically deposited into my Piggy Bank,
  So that I can effortlessly save small amounts of money and watch my savings grow over time.

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page

  Scenario: Disable Spare Change feature
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Spare Change" button
    And I see "Funcionalidade Spare Change Desativada" information message

  Scenario: Enable Spare Change
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Spare Change" button
    And I see "Funcionalidade Spare Change Ativada" information message

  Scenario Outline: Verify if money was laid aside by the Spare Change feature after a transaction
    Then I tap the "O meu mealheiro" button
    And I see the "Mealheiro" page
    Then I see that the value stored in the piggy bank is <valor_mealheiro>
    Then I tap the "Voltar Atrás" button
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert <valor_a_enviar> in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Menu" page
    And I see "Transação efetuada" information message
    Then I tap the "O meu mealheiro" button
    Then I see that the value stored in the piggy bank is <valor_esperado>

    Examples: 
      | valor_mealheiro | valor_a_enviar | valor_esperado |
      | "0.00"          | "5.10"         | "0.90"         |
      | "0.90"          | "1.72"         | "1.18"         |
