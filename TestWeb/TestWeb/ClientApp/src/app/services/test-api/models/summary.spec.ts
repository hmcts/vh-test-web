import Dictionary from 'src/app/shared/helpers/dictionary';
import { TestData } from 'src/app/testing/mocks/test-data';
import { Summary } from './summary';

describe('Summary', () => {
    const testData = new TestData();
    const conference = testData.getConference();
    const password = '123456';
    const userPasswords = new Dictionary<string>();
    userPasswords.add(conference.participants[0].username, password);
    const summary = new Summary(conference, userPasswords);

    it('should get all summary details', () => {
        expect(summary.getCaseName()).toBe(conference.case_name);
        expect(summary.getCaseNumber()).toBe(conference.case_number);
        expect(summary.getConferenceId()).toBe(conference.id);
        expect(summary.getEndpoints()).toBe(conference.endpoints);
        expect(summary.getHearingId()).toBe(conference.hearing_id);
        expect(summary.getParticipantPassword(conference.participants[0].username)).toBe(password);
        expect(summary.getParticipants()).toBe(conference.participants);
        expect(summary.getScheduledDateTime()).toBe(conference.scheduled_date_time.toLocaleString());
    });

    it('should convert summary to text', () => {
        expect(summary.toText().length).toBeGreaterThan(0);
    });
});
