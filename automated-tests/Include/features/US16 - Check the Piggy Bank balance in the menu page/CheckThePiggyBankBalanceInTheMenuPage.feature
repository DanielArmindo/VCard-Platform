Feature: Check the Piggy Bank balance in the menu page
  As an authenticated user,
  I want to see my piggy bank balance on the menu page,
  So I can easily track my savings and make informed financial decisions.

  Scenario Outline: Check the balance of PiggyBank in menu page
    Given I start the vCard application
    Then I see the "Menu" page
    And I see that the value stored in the piggy bank is <valor_mealheiro>
    Then I tap the "O meu mealheiro" button
    And I see the "Mealheiro" page
    And I insert "100" in the value field
    Then I tap the "Reforçar" button
    And I see "Mealheiro atualizado com sucesso" information message
    Then I tap the "Voltar Atrás" button
    And I see that the value stored in the piggy bank is <valor_esperado>

    Examples: 
      | valor_mealheiro | valor_esperado |
      | "0.00"          | "100.00"       |
