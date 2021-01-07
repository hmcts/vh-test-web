Feature: Events
	In order to allow developers to test dev changes
	As a develepor
	I want to be able to quickly simulate the sending of events

@VIH-6691
Scenario: Send hearing event
	Given the user has progressed to the Events page
	When the user sends a hearing event
	Then the hearing status changes

@VIH-6691
Scenario: Send participant event
	Given the user has progressed to the Events page
	When the user sends a participant event
	Then the participant status changes