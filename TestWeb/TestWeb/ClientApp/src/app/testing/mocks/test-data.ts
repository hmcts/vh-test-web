import { EventModel } from 'src/app/common/models/event-model';
import { HearingModel } from 'src/app/common/models/hearing.model';
import { UserModel } from 'src/app/common/models/user.model';
import {
    AllocationDetailsResponse,
    Application,
    ConferenceDetailsResponse,
    ConferenceResponse,
    ConferenceState,
    EndpointResponse,
    EventType,
    HearingDetailsResponse,
    HearingResponse,
    ParticipantDetailsResponse,
    ParticipantResponse,
    ParticipantResponse2,
    ParticipantState,
    TestType,
    UserDetailsResponse,
    UserRole,
    UserType
} from 'src/app/services/clients/api-client';
import { AllocationFormData } from 'src/app/services/test-api/models/allocation-form-data';
import { HearingFormData } from 'src/app/services/test-api/models/hearing-form-data';
import { Summary } from 'src/app/services/test-api/models/summary';
import Dictionary from 'src/app/shared/helpers/dictionary';

export class TestData {
    createEventModel(): EventModel {
        const event = new EventModel();
        event.conference_id = '123';
        event.event_type = EventType.Close;
        event.participant_id = '456';
        return event;
    }

    createHearingFormData(): HearingFormData {
        const hearingDate = new Date();
        return {
            application: Application.VideoWeb,
            customCaseNamePrefix: 'custom',
            hearingDate: hearingDate,
            hearingStartTimeHour: hearingDate.getHours(),
            hearingStartTimeMinute: hearingDate.getMinutes(),
            individuals: 1,
            interpreters: 1,
            numberOfHearings: 1,
            observers: 1,
            panelMembers: 1,
            questionnaireNotRequired: true,
            representatives: 1,
            testType: TestType.Manual,
            audioRecordingRequired: false,
            scheduledDateTime: hearingDate,
            numberOfEndpoints: 0,
            reuseUsers: false,
            witnesses: 1
        };
    }

    createHearingModel(): HearingModel {
        const hearingModel = new HearingModel();
        hearingModel.application = Application.VideoWeb;
        hearingModel.audio_recording_required = false;
        hearingModel.case_type = 'case type';
        hearingModel.created_by = 'user@hmcts.net';
        hearingModel.custom_case_name_prefix = 'custom';
        hearingModel.endpoints = 1;
        hearingModel.questionnaire_not_required = true;
        hearingModel.scheduled_date_time = new Date();
        hearingModel.test_type = TestType.Manual;
        hearingModel.users = this.createUsers();
        hearingModel.venue = 'venue';
        return hearingModel;
    }

    createAllocationFormData(): AllocationFormData {
        return {
            application: Application.VideoWeb,
            expiry_in_minutes: 1,
            userType: UserType.Individual,
            testType: TestType.Manual
        };
    }

    createUsers(): UserModel[] {
        const users = [];
        users.push(this.createUserModel());
        return users;
    }

    createUserModel(): UserModel {
        return {
            username: 'user@hmcts.net',
            contact_email: 'contact_email@hmcts.net',
            first_name: 'first name',
            last_name: 'last name',
            display_name: 'display name',
            number: 1,
            test_type: TestType.Manual,
            user_type: UserType.Individual,
            application: Application.VideoWeb,
            is_prod_user: false
        };
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
        const endpoints = [];
        endpoints.push(new EndpointResponse());
        conference.endpoints = endpoints;
        conference.hearing_id = '1000';
        conference.hearing_venue_name = 'court';
        conference.id = '1001';
        conference.meeting_room = null;
        conference.participants = this.getConferenceParticipants();
        conference.scheduled_date_time = today;
        conference.scheduled_duration = 90;
        conference.started_date_time = today;

        return conference;
    }

    getConferenceParticipants(): ParticipantDetailsResponse[] {
        const participants = [];
        const participant = new ParticipantDetailsResponse();
        participant.case_type_group = 'casetype';
        participant.contact_email = 'test.user@hmcts.net';
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
        participant.username = 'test.username@hmcts.net';
        participants.push(participant);
        return participants;
    }

    getAllocatedUsersResponse(): UserDetailsResponse[] {
        const today = new Date();
        const userDetailsResponse: UserDetailsResponse[] = [];
        const userDetails = new UserDetailsResponse();
        userDetails.application = Application.VideoWeb;
        userDetails.contact_email = 'test.user@hmcts.net';
        userDetails.created_date = today;
        userDetails.display_name = 'firstname lastname';
        userDetails.first_name = 'firstname';
        userDetails.id = '1000';
        userDetails.is_prod_user = false;
        userDetails.last_name = 'lastname';
        userDetails.number = 10;
        userDetails.test_type = TestType.Manual;
        userDetails.user_type = UserType.Individual;
        userDetails.username = 'test.username@hmcts.net';
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
        hearingDetailsResponse.participants = this.getHearingParticipants();
        hearingDetailsResponse.questionnaire_not_required = true;
        hearingDetailsResponse.scheduled_date_time = new Date();
        hearingDetailsResponse.scheduled_duration = 90;
        hearingDetailsResponse.updated_by = '';
        hearingDetailsResponse.updated_date = null;

        return hearingDetailsResponse;
    }

    getHearingParticipants(): ParticipantResponse2[] {
        const participants = [];
        const participant = new ParticipantResponse();
        participant.case_role_name = 'case role';
        participant.contact_email = 'test.user@hmcts.net';
        participant.telephone_number = '234567890';
        participant.display_name = 'firstname lastname';
        participant.first_name = 'first name';
        participant.hearing_role_name = 'hearing role';
        participant.id = '200';
        participant.last_name = 'lastname';
        participant.representee = '';
        participant.user_role_name = UserRole.Individual;
        participant.username = 'test.user@hmcts.net';
        participants.push(participant);
        return participants;
    }

    getAllocationDetailsResponse(): AllocationDetailsResponse {
        const allocationDetailsResponse = new AllocationDetailsResponse();
        allocationDetailsResponse.id = '123';
        allocationDetailsResponse.user_id = '456';
        allocationDetailsResponse.username = 'user@hmcts.net';
        allocationDetailsResponse.expires_at = new Date();
        allocationDetailsResponse.allocated = true;
        allocationDetailsResponse.allocated_by = 'user@hmcts.net';
        return allocationDetailsResponse;
    }

    getAllocatedUserModel(): UserModel[] {
        const allocatedUsers: UserModel[] = [];
        const userModel = new UserModel();
        userModel.application = Application.VideoWeb;
        userModel.contact_email = 'test.user@hmcts.net';
        userModel.created_date = new Date();
        userModel.display_name = 'firstname lastname';
        userModel.first_name = 'firstname';
        userModel.is_prod_user = false;
        userModel.last_name = 'lastname';
        userModel.number = 100;
        userModel.test_type = TestType.Manual;
        userModel.user_type = UserType.Individual;
        userModel.username = 'test.user@hmcts.net';
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

        const judge = new ParticipantResponse2();
        judge.display_name = 'judge';
        judge.hearing_role = 'judge';
        judge.id = '123';
        judge.status = ParticipantState.NotSignedIn;
        judge.user_role = UserRole.Judge;
        judge.username = 'judge@mail.net';
        participants.push(judge);

        const individual = new ParticipantResponse2();
        individual.display_name = 'individual';
        individual.hearing_role = 'Individual';
        individual.id = '456';
        individual.status = ParticipantState.NotSignedIn;
        individual.user_role = UserRole.Individual;
        individual.username = 'individial@hmcts.net';
        participants.push(individual);

        response.participants = participants;

        return response;
    }

    getConferencesResponse(): ConferenceResponse[] {
        const conferences = [];
        const conference = this.getConferenceResponse();
        conferences.push(conference);
        return conferences;
    }

    getJudgeId(participants: ParticipantResponse2[]) {
        for (const participant of participants) {
            if (participant.user_role === UserRole.Judge) {
                return participant.id;
            }
        }
    }

    getHearingResponse(): HearingResponse {
        const response = new HearingResponse();
        response.id = '234';
        response.case_name = 'case_name';
        response.scheduled_date = new Date();
        return response;
    }

    getUserPasswords(): Dictionary<string> {
        const passwords = new Dictionary<string>();
        passwords.add('test.user@hmcts.net', 'password');
        return passwords;
    }

    getSummary(): Summary {
        const conference = this.getConference();
        const passwords = this.getUserPasswords();
        return new Summary(conference, passwords);
    }
}
