Feature: Create Hearings
	In order to quickly create manual test data
	As a tester, demo-er or secOps team member
	I want to be able to quickly and easily create test data

@VIH-6690 @VIH-6950 @Smoketest
Scenario: Create hearing
	Given the user has progressed to the Create Hearings page
	When the user creates 2 hearings with 1 endpoint
	Then the confirmation dialog shows hearings were created
	And the summary page displays the new hearing details
	When the user returns to the Create Hearings page
	Then the user is on the create hearings page

@VIH-6690
Scenario Outline: Cannot create hearings in the past
	Given the user has progressed to the Create Hearings page
	When the date is set to a past date
	Then an error appears stating the hearing time must be in the future
	When the date is set to a date that exceeds the limit
	Then an error appears stating the hearing date must be within a limit

@VIH-6690
Scenario: Numbers of participants
	Given the user has progressed to the Create Hearings page
	When the user attempts to exceed the allowed participants
	Then errors should appear to state that the numbers are too high
	When the user attempts to not add any individuals or representatives
	Then an error message appears stating that there are no individuals or representatives

@VIH-6993
Scenario: Create hearing with a custom case name 
	Given the user has progressed to the Create Hearings page
	When the user creates a hearing with a custom name
	Then the confirmation dialog shows hearings were created
	And the custom name is visible on the hearing name