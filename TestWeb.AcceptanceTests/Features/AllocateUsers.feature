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

@VIH-6694
Scenario: Cannot enter invalid days, hours and minutes
	Given the user has progressed to the Allocate Users page
	When the user attempts to add invalid days, hours and minutes
	Then the days, hours and minutes error messages are displayed
	When the user attempts to add zero for days, hours and minutes
	Then the zero days, hours and minutes error messages are displayed
	And the allocate button is disabled

@VIH-6976
Scenario: Unallocate all users
	Given the user has progressed to the Allocate Users page
	When the user allocates an individual user
	Then the allocated username and password are displayed
	When the user allocates another individual user
	Then the allocated username and password are displayed
	When the user unallocates all users
	Then there a no users allocated