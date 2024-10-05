Feature: Carry out operations in the piggy bank
  As an authenticated user,
  I want to control my piggy bank effectively,
  So that i can carry out piggy bank-related operations with ease and security.

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "O meu mealheiro" button
    And I see the "Mealheiro" page

  Scenario: Check that the amount to be added to the piggy bank is greater than 0
    And I insert "0" in the value field
    Then I tap the "Reforçar" button
    Then I see the "O valor deve ser um número maior que 0" error message

  Scenario: Check that the amount to be added to the piggy bank is less or equal than the balance on the vcard
    And I insert "5000" in the value field
    Then I tap the "Reforçar" button
    Then I see the "Saldo insuficiente. Não é possível reforçar o mealheiro com o valor especificado" error message

  Scenario: Check that the amount to be added to the piggy bank contains only numbers
    And I insert "0D" in the value field
    Then I tap the "Reforçar" button
    Then I see the "O valor inserido não é numérico" error message

  Scenario: Check that the amount to be withdrawn from the piggy bank is greater than 0
    And I insert "0" in the value field
    Then I tap the "Retirar" button
    Then I see the "O valor deve ser um número maior que 0" error message

  Scenario: Check that the amount to be withdrawn from the piggy bank is less than or equal to its balance
    And I insert "500" in the value field
    Then I tap the "Retirar" button
    Then I see the "Saldo insuficiente no mealheiro. Não é possível retirar o valor especificado" error message

  Scenario: Check that the amount to be withdrawn from the piggy bank contains only numbers
    And I insert "0D" in the value field
    Then I tap the "Retirar" button
    Then I see the "O valor inserido não é numérico" error message
