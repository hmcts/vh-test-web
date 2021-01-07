import { UserModel } from 'src/app/common/models/user.model';
import {
    Application,
    ConferenceDetailsResponse,
    ConferenceResponse,
    ConferenceState,
    HearingDetailsResponse,
    ParticipantDetailsResponse,
    ParticipantResponse,
    ParticipantState,
    TestType,
    UserDetailsResponse,
    UserRole,
    UserType
} from 'src/app/services/clients/api-client';
import { HearingFormData } from 'src/app/services/test-api/models/hearing-form-data';

export class TestApiServiceTestData {
    createHearingFormData(): HearingFormData {
        const hearingDate = new Date();
        const hearingFormData: HearingFormData = {
            application: Application.VideoWeb,
            hearingDate: hearingDate,
            hearingStartTimeHour: hearingDate.getHours(),
            hearingStartTimeMinute: hearingDate.getMinutes(),
            individuals: 1,
            numberOfHearings: 1,
            observers: 0,
            panelMembers: 0,
            questionnaireNotRequired: true,
            representatives: 1,
            testType: TestType.Manual,
            audioRecordingRequired: false,
            scheduledDateTime: hearingDate
        };

        return hearingFormData;
    }

    getConference(): ConferenceDetailsResponse {
        const today = new Date(new Date().setHours(10, 10, 0, 0));

        const conference = new ConferenceDetailsResponse();
        conference.audio_recording_required = false;
        conference.case_name = 'test case name';
        conference.case_number = 'case number';
        conference.case_type = 'tax';
        conference.closed_date_time = null;
        conference.current_status = ConferenceState.NotStarted;
        conference.endpoints = null;
        conference.hearing_id = '1000';
        conference.hearing_venue_name = 'court';
        conference.id = '1001';
        conference.meeting_room = null;
        conference.participants = this.getParticipants();
        conference.scheduled_date_time = today;
        conference.scheduled_duration = 90;
        conference.started_date_time = today;

        return conference;
    }

    getParticipants(): ParticipantDetailsResponse[] {
        const participants: ParticipantDetailsResponse[] = [];
        const participant = new ParticipantDetailsResponse();
        participant.case_type_group = 'casetype';
        participant.contact_email = 'test.user@email.com';
        participant.contact_telephone = '234567890';
        participant.current_status = ParticipantState.Available;
        participant.display_name = 'firstname lastname';
        participant.first_name = 'first name';
        participant.hearing_role = 'hearing role';
        participant.id = '200';
        participant.last_name = 'lastname';
        participant.name = 'name';
        participant.ref_id = 'referenceid';
        participant.representee = '';
        participant.user_role = UserRole.Individual;
        participant.username = 'test.user@email.net';

        return participants;
    }

    getAllocatedUsersResponse(): UserDetailsResponse[] {
        const today = new Date();

        const userDetailsResponse: UserDetailsResponse[] = [];
        const userDetails = new UserDetailsResponse();
        userDetails.application = Application.VideoWeb;
        userDetails.contact_email = 'test.user@email.com';
        userDetails.created_date = today;
        userDetails.display_name = 'firstname lastname';
        userDetails.first_name = 'firstname';
        userDetails.id = '1000';
        userDetails.is_prod_user = false;
        userDetails.last_name = 'lastname';
        userDetails.number = 10;
        userDetails.test_type = TestType.Manual;
        userDetails.user_type = UserType.Individual;
        userDetails.username = 'test.user@email.net';
        userDetailsResponse.push(userDetails);

        return userDetailsResponse;
    }

    getHearingDetails(): HearingDetailsResponse {
        const hearingDetailsResponse = new HearingDetailsResponse();
        hearingDetailsResponse.audio_recording_required = false;
        hearingDetailsResponse.cancel_reason = '';
        hearingDetailsResponse.case_type_name = 'tax';
        hearingDetailsResponse.cases = null;
        hearingDetailsResponse.confirmed_by = 'admin';
        hearingDetailsResponse.confirmed_date = new Date();
        hearingDetailsResponse.created_by = 'admin';
        hearingDetailsResponse.created_date = new Date();
        hearingDetailsResponse.endpoints = null;
        hearingDetailsResponse.group_id = 'group';
        hearingDetailsResponse.hearing_room_name = 'room1';
        hearingDetailsResponse.hearing_type_name = 'hearing type';
        hearingDetailsResponse.hearing_venue_name = 'court 1';
        hearingDetailsResponse.id = '100';
        hearingDetailsResponse.other_information = 'other information';
        hearingDetailsResponse.participants = this.getParticipants();
        hearingDetailsResponse.questionnaire_not_required = true;
        hearingDetailsResponse.scheduled_date_time = new Date();
        hearingDetailsResponse.scheduled_duration = 90;
        hearingDetailsResponse.updated_by = '';
        hearingDetailsResponse.updated_date = null;

        return hearingDetailsResponse;
    }

    getAllocatedUserModel(): UserModel[] {
        const allocatedUsers: UserModel[] = [];
        const userModel = new UserModel();
        userModel.application = Application.VideoWeb;
        userModel.contact_email = 'test.user@email.com';
        userModel.created_date = new Date();
        userModel.display_name = 'firstname lastname';
        userModel.first_name = 'firstname';
        userModel.is_prod_user = false;
        userModel.last_name = 'lastname';
        userModel.number = 100;
        userModel.test_type = TestType.Manual;
        userModel.user_type = UserType.Individual;
        userModel.username = 'test.user@email.net';
        allocatedUsers.push(userModel);

        return allocatedUsers;
    }

    getConferenceResponse(): ConferenceResponse {
      const response = new ConferenceResponse();
      response.case_name = 'case name';
      response.hearing_ref_id = '123';
      response.id = '456';
      response.status = ConferenceState.NotStarted;

      const participants = [];

      const judge = new ParticipantResponse();
      judge.display_name = 'judge';
      judge.hearing_role = 'judge';
      judge.id = '123';
      judge.status = ParticipantState.NotSignedIn;
      judge.user_role = UserRole.Judge;
      judge.username = 'judge@mail.net';
      participants.push(judge);

      const individual = new ParticipantResponse();
      individual.display_name = 'individual';
      individual.hearing_role = 'Individual';
      individual.id = '456';
      individual.status = ParticipantState.NotSignedIn;
      individual.user_role = UserRole.Individual;
      individual.username = 'individial@mail.net';
      participants.push(individual);

      response.participants = participants;
      
      return response;
    }
}
