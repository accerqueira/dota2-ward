Feature: GetMatchHistory
  Scenario: Get history of matches by sequence number
    Given a dota2-ward instance
    When match history by sequence number is requested
    Then the result should be a MatchHistoryBySequenceNum
    And it should be a list of MatchDetails
