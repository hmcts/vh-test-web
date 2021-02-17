import { HearingModel } from 'src/app/common/models/hearing.model';
import { Application, TestType, User, UserType } from '../../clients/api-client';
import { MapHearing } from './map-hearing';

describe('MapHearing', () => {
    const mapper = new MapHearing();

    it('should map the HearingModel to the CreateHearingRequest', () => {
        const users = [];
        const user = new User();
        user.application = Application.AdminWeb;
        user.contact_email = 'test.user@hmcts.net';
        user.created_date = new Date();
        user.display_name = 'test user';
        user.first_name = 'test';
        user.is_prod_user = false;
        user.last_name = 'user';
        user.number = 1;
        user.test_type = TestType.Manual;
        user.user_type = UserType.CaseAdmin;
        user.username = 'user.test@email.net';

        users.push(user);
        const hearingModel: HearingModel = {
            application: Application.AdminWeb,
            case_type: 'case type name',
            created_by: 'user@hmcts.net',
            custom_case_name_prefix: 'automation test',
            questionnaire_not_required: true,
            test_type: TestType.Manual,
            users: users,
            venue: 'court',
            audio_recording_required: false,
            scheduled_date_time: new Date(),
            endpoints: 0
        };

        const request = MapHearing.map(hearingModel);
        expect(request.application).toBe(hearingModel.application);
        expect(request.case_type).toBe(hearingModel.case_type);
        expect(request.custom_case_name_prefix).toBe(hearingModel.custom_case_name_prefix);
        expect(request.questionnaire_not_required).toBe(hearingModel.questionnaire_not_required);
        expect(request.test_type).toBe(hearingModel.test_type);
        expect(request.users[0].username).toBe(hearingModel.users[0].username);
        expect(request.venue).toBe(hearingModel.venue);
        expect(request.audio_recording_required).toBe(hearingModel.audio_recording_required);
        expect(request.scheduled_date_time).toBe(hearingModel.scheduled_date_time);
    });
});
