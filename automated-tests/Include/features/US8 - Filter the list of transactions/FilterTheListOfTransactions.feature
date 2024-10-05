Feature: 
  As an authenticated user,
  I want to filter and sort the list of my transactions,
  So that I can track and review my financial activity.

  Background: 
    Given I start the vCard application
    Then I see the "Menu" page
    Then I tap the "Lista de transações" button
    And I see the "Transações" page
    Then I tap the "Filtrar e ordenar" button

  Scenario: Sort the list of transactions by most recent
    And I tap the "Ordenar Por" selection list
    And I select the "Data mais recente" option
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Sort the list of my transactions by oldest
    And I tap the "Ordenar Por" selection list
    And I select the "Data mais antiga" option
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Sort the list of my transactions by highest value
    And I tap the "Ordenar Por" selection list
    And I select the "Valor transacional maior" option
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Sort the list of my transactions by lowest value
    And I tap the "Ordenar Por" selection list
    And I select the "Valor transacional menor" option
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario Outline: Filter the list of my transactions by type
    And I tap the "Filtrar por tipo" selection list
    And I select the <option> option
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

    Examples: 
      | option    |
      | 'Débito'  |
      | 'Crédito' |
      | 'Todos'   |

  Scenario: Filter the list of my transactions by entity
    And I insert "900000013" in the entidade field
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Filter the list of transactions between two dates
    Then I tap the "Data Inicio" field
    Then I tap the "Dia 1" button
    And I tap the "Set" button
    Then I tap the "Data Fim" field
    Then I tap the "Dia 28" button
    And I tap the "Set" button
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Filter the list of my transactions starting from a date
    Then I tap the "Data Inicio" field
    Then I tap the "Dia 1" button
    And I tap the "Set" button
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Filter the list of my transactions up to a date
    Then I tap the "Data Fim" field
    Then I tap the "Dia 28" button
    And I tap the "Set" button
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Reset filters and sorting
    And I tap the "Ordenar Por" selection list
    And I select the "Valor transacional maior" option
    And I tap the "Filtrar por tipo" selection list
    And I select the "Crédito" option
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list
    Then I tap the "Filtrar e ordenar" button
    And I tap the "Redefinir Filtros" button
    Then I tap the "Aplicar Filtros" button
    And I see my transaction list

  Scenario: Check that the end date field is a later date than the start date.
    Then I tap the "Data Inicio" field
    Then I tap the "Dia 28" button
    And I tap the "Set" button
    Then I tap the "Data Fim" field
    Then I tap the "Dia 1" button
    And I tap the "Set" button
    Then I tap the "Aplicar Filtros" button
    And I see the "O campo da data fim deve ser uma data posterior à data de início" error message
