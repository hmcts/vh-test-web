Feature: Login
	In order to access to test api
	As a registered VH service user
	I want to only have access if I am authorised to do so

@VIH-6627
Scenario: Test Web User Login
	Given a new browser is open for a Tester user
	When the user logs in with valid credentials
	Then the user is on the Create Hearings page
	When the user attempts to logout
	Then the user should be navigated to sign in screen

@VIH-6627
Scenario: Judge User Login Denied
	Given a new browser is open for a Judge user
	When the user logs in with valid credentials
	Then the user is on the Unauthorised page

@VIH-6627 @Smoketest
Scenario: VHO User Login Denied
	Given a new browser is open for a Video Hearings Officer user
	When the user logs in with valid credentials
	Then the user is on the Unauthorised page

@VIH-6627 @Smoketest
Scenario: Individual User Login Denied
	Given a new browser is open for an Individual user
	When the user logs in with valid credentials
	Then the user is on the Unauthorised page