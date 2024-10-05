Feature: Identify vCards contacts in the contacts list
  As a user, 
  I want to be able to see which of my contacts have vCards accounts,
  So that I can easily identify contacts who are also using vCard

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Enviar Dinheiro" button
    And I see my contacts list

  Scenario: Verify if the list is empty
    Then I see "Sem Contactos" information message

  Scenario: Verify that there are no contacts associated with vCard
    And I verify that the "Número de contactos associados ao vCard" corresponds to "0"

  Scenario: Identify a vCard contact
    Then I tap the "Novo Contacto" button
    Then I see the "Novo Contacto" page
    And I insert "900000013" in the phone number field
    And I insert "Sebastião Vaz" in the name field
    Then I tap the "Criar e continuar" button
    Then I tap the "Voltar Atrás" button
    Then I see the contact "Sebastião Vaz" with the tag "VCARD"
