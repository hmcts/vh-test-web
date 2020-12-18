Feature: Create Hearings
	In order to quickly create manual test data
	As a tester, demo-er or secOps team member
	I want to be able to quickly and easily create test data

@VIH-6690 @Smoketest
Scenario: Create hearing
	Given the user has progressed to the Create Hearings page
	When the user creates 2 hearings
	Then the progress is visible
	And the conference details appear in the summary

@VIH-6690
Scenario Outline: Cannot create hearings in the past
	Given the user has progressed to the Create Hearings page
	When the date is set to the past
	Then an error appears stating the hearing time must be in the future