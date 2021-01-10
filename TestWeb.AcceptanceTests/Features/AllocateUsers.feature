Feature: Allocate Users
	In order to allow testers and devs to access the apps
	As a develepor, tester, demoer or ithc user
	I want to be able to quickly create an authorised user

@VIH-6694
Scenario: Allocate and unallocate a user
	Given the user has progressed to the Allocate Users page
	When the user allocates an individual user
	Then the allocated username and password are displayed
	When the user unallocates the user
	Then the user is no longer allocated

@VIH-6694
Scenario: Reset allocated user password
	Given the user has progressed to the Allocate Users page
	When the user allocates an individual user
	Then the allocated username and password are displayed
	When the user resets the users password
	Then the reset password is displayed