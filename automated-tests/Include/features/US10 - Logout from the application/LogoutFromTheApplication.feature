Feature: Logout from the application
  As a user who has already created a vCard,
  I want to logout from the application,
  So that I can securely end my session.

  Scenario: 
    Given I start the vCard application
    Then I tap the "Definições" button
    And I see the "Definições" page
    Then I tap the "Logout" button
    And I see the "VCard" page
