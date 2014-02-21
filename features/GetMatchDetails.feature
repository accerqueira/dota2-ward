Feature: GetMatchDetails
  Scenario: Get details of a match by ID
    Given the match ID '2704974'
    When match details is requested
    Then the result should be a MatchDetails
    And the winner should be the Dire
