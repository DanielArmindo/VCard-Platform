Feature: Verify information of the last transaction
  As a user,
  I want to quickly and easily view the details of the last transaction I made after sending money to a contact
  So that I can verify and review relevant information such as date, amount, and recipient details for my records.

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page

  Scenario Outline: Check that the information on the last transaction corresponds to the transaction performed
    And I see the current balance with value <saldo_antes>
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    And I choose the contact with the phone number <contacto_a_escolher>
    Then I see the "Enviar dinheiro" page
    Then I insert <valor_a_enviar> in the value field
    And I insert <descrição> in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Menu" page
    And I see "Transação efetuada" information message
    Then I see the last transaction
    * I verify that the "Entidade" corresponds to <entidade_esparada>
    * I verify that the "Referência" corresponds to <referência_esperada>
    * I verify that the "Valor" corresponds to <valor_esperado>
    * I verify that the "Tipo Pagamento" corresponds to <tipo_pagamento>
    * I verify that the "Tipo Transação" corresponds to <tipo_transação>
    * I verify that the "Saldo Antes" corresponds to <saldo_antes>
    * I verify that the "Saldo Depois" corresponds to <saldo_depois>
    * I verify that the "Descrição" corresponds to <descrição>
    * I verify that the data corresponds to today's date.

    Examples: 
      | contacto_a_escolher | valor_a_enviar | descrição  | entidade_esparada | referência_esperada | valor_esperado | tipo_pagamento | tipo_transação | saldo_antes | saldo_depois |
      | "900000005"         | "15.00"        | "Propinas" | "900000005"       | "900000005"         | "-15.00 €"     | "VCARD"        | "Débito"       | "500.00 €"  | "485.00 €"   |
