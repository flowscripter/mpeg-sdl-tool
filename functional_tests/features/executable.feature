Feature: Executable

  Scenario: Executable success
    When the executable is launched
    Then the executable should complete with exit code 2
    And the executable should have output "No command specified"

  Scenario: Validate invalid SDL
    When the executable is launched with arguments "validate --input features/sample_specifications/invalid.sdl"
    Then the executable should complete with exit code 0
    And the executable should have output "Unable to consume token: _packet"

  Scenario: Validate valid SDL
    When the executable is launched with arguments "validate -i features/sample_specifications/valid.sdl" 
    Then the executable should complete with exit code 0
    And the executable should have output "is valid"
