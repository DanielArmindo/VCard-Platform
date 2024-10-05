Feature: Notifications
  As a user,
  I want instant notifications when I receive money,
  So that I can quickly and easily stay informed in real-time.

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page

  Scenario: Receive notifications with the application open
    Given I receive a transaction of value "5"
    Then I see the "Recebeu 5€ de Sebastião Vaz" notification message

  Scenario: Receber notificações com a aplicação fechada
    Then I close the vCard application
    Given I receive a transaction of value "5"
    Then I see the "Received 5€ de Sebastião Vaz" notification message

  Scenario: Ver a lista de notificações
    Then I tap the "Notifications" button
    And I see the notifications list

  Scenario: Marcar uma notificação como lida
    Then I tap the "Notifications" button
    And I see the notifications list
    Then I tap the "Marcar como lida" button

  Scenario Outline: Verify If the last notification corresponds to the last transaction
    And I see the current balance with value "0.00 €"
    Given I receive a transaction of value "5"
    Then I see the "Received 5€ de Sebastião Vaz" notification message
    Then I see the last transaction
    * I verify that the "Valor" corresponds to <valor_esperado>

    Examples: 
      | valor_esperado |
      | "+5.00 €"      |

  Scenario: Verify if there are notifications to be read
    Then I see the icon notification

  Scenario Outline: Verify If the balance updates after notification
    And I see the current balance with value <saldo_antes>
    Then I see the "Recebeu 5€ de Sebastião Vaz" message
    And I see the current balance with value <saldo_depois>

    Examples: 
      | saldo_depois | saldo_antes |
      | "505.00 €"   | "500.00 €"  |
