Feature: Send money to another user
  As an authenticated user,
  I want to send money to other users
  So that I can perform transfers easily and securely.

  Background: 
    Given I start the vCard application

  Scenario: Send Money to a New Contact
    When I insert "900000002" in the phone number field
    And I tap the "Continuar" button
    Then I see the "Aceder ao Vcard" page
    And I insert "123" in the password field
    And I tap the "Entrar" button
    Then I see the "Menu" page
    And I tap the "Enviar dinheiro" button
    Then I tap the "Allow" button
    Then I see the "Contactos" page
    Then I tap the "Novo Contacto" button
    Then I see the "Novo Contacto" page
    And I insert "900000013" in the phone number field
    And I insert "Sebastião Vaz" in the name field
    Then I tap the "Criar e continuar" button
    Then I see the "Enviar dinheiro" page
    And I see "Contacto criado com sucesso" information message
    Then I insert "5" in the value field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "confirmar" button
    Then I see the "Menu" page
    And I see "Transação efetuada" information message

  Scenario: Send Money to an Existing Contact
    Then I see the "Menu" page
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

  Scenario: Verify value field is inserted
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "O valor deve ser um número maior que 0" error message

  Scenario: Verify the Pin Confirmation
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "5" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "124" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Pin de confirmação errado" error message

  Scenario: Verify if phone number have only numbers in Novo Contacto page
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    Then I tap the "Novo Contacto" button
    Then I see the "Novo Contacto" page
    And I insert "9000asd00" in the phone number field
    And I insert "Sebastião Vaz" in the name field
    Then I tap the "Criar e Continuar" button
    Then I see the "O número de telemóvel não pode conter caractéres não numéricos" error message

  Scenario: Verify if value field has only numbers
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "5C.32" in the value field
    Then I tap the "Avançar" button
    Then I see the "O valor deve ser um número maior que 0" error message

  Scenario: Verify if contacts do not exist
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    Then I tap the "Novo Contacto" button
    Then I see the "Novo Contacto" page
    And I insert "999999999" in the phone number field
    And I insert "Não Existe" in the name field
    Then I tap the "Criar e Continuar" button
    Then I see the "Enviar dinheiro" page
    Then I insert "5" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "O destinatário não tem vCard" error message

  Scenario: Verify if number length is 9 in Novo Contacto page
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    And I see my contacts list
    Then I tap the "Novo Contacto" button
    Then I see the "Novo Contacto" page
    And I insert "90003450670" in the phone number field
    And I insert "Sebastião Vaz" in the name field
    Then I tap the "Criar e Continuar" button
    Then I see the "O número de telemóvel tem de ter 9 dígitos" error message

  Scenario: Inserting a number that does not start with 9 in the phone number field in Novo Contacto page
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    Then I tap the "Novo Contacto" button
    Then I see the "Novo Contacto" page
    And I insert "100000000" in the phone number field
    And I insert "Sebastião Vaz" in the name field
    Then I tap the "Criar e Continuar" button
    Then I see the "O número de telemóvel deve começar por 9" error message

  Scenario: Verify if the Pin is inserted
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "5" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    And I tap the "Confirmar" button
    Then I see the "O pin deve ter 3 dígitos" error message

  Scenario: Send Money to a Contact without having enough funds
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "4999" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Sem saldo suficiente para efetuar a transação" error message

  Scenario: Send Money to their own contact
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Meu Contacto"
    Then I see the "Enviar dinheiro" page
    Then I insert "5" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Não pode fazer uma transação para si mesmo" error message

  Scenario: Send an amount of money that exceeds the maximum debit limit
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "5001" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "123" in the pin field
    And I tap the "Confirmar" button
    Then I see the "Ultrapassou o valor máximo de débito" error message

  Scenario: Verify if the pin field has only numeric characters
    Then I see the "Menu" page
    Then I tap the "Enviar dinheiro" button
    Then I see my contacts list
    And I choose the contact "Sebastião Vaz"
    Then I see the "Enviar dinheiro" page
    Then I insert "5" in the value field
    And I insert "Almoço" in the description field
    Then I tap the "Avançar" button
    Then I see the "Confirmar transação" page
    Then I insert "abc" in the pin field
    And I tap the "Confirmar" button
    Then I see the "O pin deve conter apenas números" error message
