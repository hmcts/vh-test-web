Feature: Accessibility
	In order to ensure Test Web is accessible to all users
	As a service
	I want to check each page for potential accessibility issues

@Accessibility
Scenario: Home Page Accessibility
	Given the user has progressed to the Home page with a hearing
	Then the page should be accessible

@Accessibility
Scenario: Create Hearing Page Accessibility
	Given the user has progressed to the Create Hearings page
	Then the page should be accessible

@Accessibility
Scenario: Summary Page Accessibility
	Given the user has progressed to the Summary page
	Then the page should be accessible

@Accessibility
Scenario: Delete Hearings Page Accessibility
	Given the user has progressed to the Delete Hearings page with a hearing
	Then the page should be accessible

@Accessibility
Scenario: Events Page Accessibility
	Given the user has progressed to the Events page
	Then the page should be accessible

@Accessibility
Scenario: Allocate Users Page Accessibility
	Given the user has progressed to the Allocate Users page
	Then the page should be accessible