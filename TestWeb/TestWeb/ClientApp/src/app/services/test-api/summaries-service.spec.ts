import Dictionary from 'src/app/shared/helpers/dictionary';
import { TestData } from 'src/app/testing/mocks/test-data';
import { Summary } from './models/summary';
import { SummeriesService } from './summeries-service';

describe('SummeriesService', () => {
    let service: SummeriesService;
    const summaries: Summary[] = [];

    beforeEach(() => {
        service = new SummeriesService();

        const conferenceDetailsResponse = new TestData().getConference();
        const userPasswords = new Dictionary<string>();
        userPasswords.add('name', 'password');

        const summary = new Summary(conferenceDetailsResponse, userPasswords);
        summaries.push(summary);
        service.setSummaries(summaries);
    });

    it('should get the summary data', () => {
        const result = service.getSummaries();
        expect(result).not.toBeNull();
    });
});
