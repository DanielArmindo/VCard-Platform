Feature: Send money to non-contacts
  As an authenticated user, 
  I want to send money to non-contacts, 
  So that I can easily transfer funds to individuals who may not be in my contact list.

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page
    And I tap the "Enviar dinheiro" button
    Then I see my contacts list
    Then I tap the "Enviar Para Número de Telemóvel" button
    Then I see the "Enviar dinheiro" page

  Scenario: Send Money to a Non-contact user
    And I insert "900000013" in the phone number field
    Then I insert "5" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "confirmar" button
    Then I see the "Menu" page
    And I see "Transação efetuada" information message

  Scenario: Verify if phone number field length is 9
    And I insert "9000000003" in the phone number field
    Then I insert "5" in the value field
    Then I tap the "Avançar" button
    Then I see the "O número de telemóvel tem de ter 9 dígitos" error message

  Scenario: Verify if phone number field starts with the digit 9
    And I insert "100000003" in the phone number field
    Then I insert "5" in the value field
    Then I tap the "Avançar" button
    Then I see the "O número de telemóvel deve começar por 9" error message

  Scenario: Verify if phone number field does not contains non-numeric characters
    And I insert "9000asd00" in the phone number field
    Then I insert "5" in the value field
    Then I tap the "Avançar" button
    Then I see the "O número de telemóvel não pode conter caractéres não numéricos" error message

  Scenario: Verify if the phone number field is inserted
    Then I insert "5" in the value field
    Then I tap the "Avançar" button
    Then I see the "O número de telemóvel não pode estar vazio" error message

  Scenario: Verify if value field does not contains non-numeric characters
    And I insert "900000003" in the phone number field
    Then I insert "5cd" in the value field
    Then I tap the "Avançar" button
    Then I see the "O valor deve ser um número maior que 0" error message

  Scenario: Verify if the value field is inserted
    And I insert "900000003" in the phone number field
    Then I tap the "Avançar" button
    Then I see the "O valor deve ser um número maior que 0" error message

  Scenario: Send Money to a phone number that is not associated to vcard
    Then I insert "999999999" in the phone number field
    Then I insert "1" in the value field
    Then I tap the "Avançar" button
    Then I see the "O destinatário não tem vCard" error message

  Scenario: Send an amount of money that exceeds the maximum debit limit
    Then I insert "900000013" in the phone number field
    Then I insert "7000" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Ultrapassou o valor máximo de débito" error message

  Scenario: Send Money without having enough funds
    Then I insert "900000013" in the phone number field
    Then I insert "11000" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Sem saldo suficiente para efetuar a transação" error message

  Scenario: Verify the Pin Confirmation is incorrect
    Then I insert "900000013" in the phone number field
    Then I insert "1" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "124" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Pin de confirmação errado" error message

  Scenario: Verify if you're sending money to yourself
    Then I insert "900000001" in the phone number field
    Then I insert "1" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Não pode fazer uma transação para si mesmo" error message

  Scenario: Verify if pin field length is 3
    Then I insert "900000013" in the phone number field
    Then I insert "1" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "1245" in the pin field
    And I tap the "Confirmar" button
    Then I see the "O pin deve ter 3 dígitos" error message

  Scenario: Verify if the pin field does not contains non-numeric characters
    Then I insert "900000013" in the phone number field
    Then I insert "1" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "12d" in the pin field
    And I tap the "Confirmar" button
    Then I see the "O pin deve conter apenas números" error message

  Scenario: Verify if the pin field is inserted
    Then I insert "900000013" in the phone number field
    Then I insert "1" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    And I tap the "Confirmar" button
    Then I see the "O pin deve ter 3 dígitos" error message
