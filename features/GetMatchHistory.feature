Feature: GetMatchHistory
  Scenario: Get history of matches by match id
    Given a dota2-ward instance
    When match history is requested
    Then the result should be a MatchHistory
    And it should be a list of MatchSummary
