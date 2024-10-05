Feature: Delete my vCard account
  As a user,
  I want to be able to delete my vCard account,
  So that I can have control over my personal information and ensure that my data is no longer stored or accessible through the vCard platform

  Scenario: Verify if the password is inserted
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "123" in the pin field
    Then I tap the "Delete Account" button
    And I see the "Introduza a sua palavra-passe" error message

  Scenario: Verify if the pin is inserted
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "12345678" in the password field
    Then I tap the "Delete Account" button
    And I see the "O pin deve ter 3 dígitos" error message

  Scenario Outline: Verify if the pin has 3 digits
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "12345678" in the password field
    And I insert <pin> in the pin field
    Then I tap the "Delete Account" button
    And I see the "O pin deve ter 3 dígitos" error message

    Examples: 
      | pin    |
      | "12"   |
      | "1234" |

  Scenario: Enter an incorrect password in the password field
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "dfef123123" in the password field
    And I insert "123" in the pin field
    Then I tap the "Delete Account" button
    Then I see the "Password ou código de confirmação errado" error message

  Scenario: Enter an incorrect pin in the confirmation pin field
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "12345678" in the password field
    And I insert "454" in the pin field
    Then I tap the "Delete Account" button
    Then I see the "Password ou código de confirmação errado" error message

  Scenario: Delete my vCard account
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "12345678" in the password field
    And I insert "123" in the pin field
    Then I tap the "Delete Account" button
    And I see "Conta eliminada com sucesso" information message
    Then I see the "Home" page

  Scenario: Delete my vCard account with a balance greater than '0'
    Given I start the vCard application
    When I insert "900000001" in the phone number field
    And I tap the "Continuar" button
    Then I see the vCard authentication page
    And I insert "123" in the password field
    And I tap the "Entrar" button
    Then I see the "Menu" page
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Delete Vcard Account" button
    Then I see the "Delete Account" page
    And I insert "123" in the password field
    And I insert "123" in the pin field
    Then I tap the "Delete Account" button
    Then I see the "Não é possível eliminar um VCard com saldo diferente de 0" error message