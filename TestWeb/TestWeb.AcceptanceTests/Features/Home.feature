Feature: Home
	In order to quickly view my data
	As a tester
	I want to see which hearings I have created or users I have allocated

@VIH-7017
Scenario: Home page view hearings and allocations
	Given the user has progressed to the Home page with a hearing
	Then the user can see the created hearing
	And the user can see the allocated users

@VIH-7017
Scenario: Home page delete a hearing
	Given the user has progressed to the Home page with a hearing
	When the user deletes the newly created hearing
	Then the hearing is deleted

@VIH-7017
Scenario: Home page unallocate a user
	Given the user has progressed to the Home page with a hearing
	When the user unallocates a user
	Then the user is unallocated

@VIH-7017
Scenario: Home page reset a user password
	Given the user has progressed to the Home page with a hearing
	When the user resets a users password
	Then the new password details are displayed