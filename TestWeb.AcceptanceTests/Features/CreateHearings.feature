Feature: Create Hearings
	In order to quickly create manual test data
	As a tester, demo-er or secOps team member
	I want to be able to quickly and easily create test data

@VIH-6690 @Smoketest
Scenario: Create hearing
	Given the user has progressed to the Create Hearings page
	When the user creates 2 hearings
	Then the confirmation dialog shows hearings were created
	And the summary page displays the new hearing details
	When the user returns to the Create Hearings page
	Then the user is on the create hearings page

@VIH-6690
Scenario Outline: Cannot create hearings in the past
	Given the user has progressed to the Create Hearings page
	When the date is set to a past date
	Then an error appears stating the hearing time must be in the future