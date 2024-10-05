Feature: Check last Transaction
  As an authenticated user 
  I want to check the details of my last transaction on my virtual card 
  So I can verify recent activity and ensure the accuracy of my financial records.

  Scenario: Check last transaction
    Given I start the vCard application
    Then I see the Menu page
    Then I see the last transaction
