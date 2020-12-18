Feature: Delete Hearings
	In order to maintain a clean environment
	As a tester
	I want to be able to easily remove unwanted test data

@VIH-6692 @Smoketest
Scenario: Delete hearing
	Given the user has progressed to the Delete Hearings page with a hearing
	When the user deletes the hearing
	Then the deleted hearing appears in the results

@VIH-6692 
Scenario: Cannot delete hearing without the word test
	Given the user has progressed to the Delete Hearings page
	When the user attempts to delete a hearing without the word test
	Then an error message appears stating the case name must have the word test