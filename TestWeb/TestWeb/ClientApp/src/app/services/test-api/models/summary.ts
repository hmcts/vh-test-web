import Dictionary from 'src/app/shared/helpers/dictionary';
import { ConferenceDetailsResponse, EndpointResponse, ParticipantDetailsResponse } from '../../clients/api-client';

export class Summary {
    constructor(conference: ConferenceDetailsResponse, userPasswords: Dictionary<string>) {
        this.caseName = conference.case_name;
        this.caseNumber = conference.case_number;
        this.scheduledDateTime = conference.scheduled_date_time.toLocaleString();
        this.hearingId = conference.hearing_id;
        this.conferenceId = conference.id;
        this.participants = conference.participants;
        this.userPasswords = userPasswords;
        this.endpoints = conference.endpoints;
    }

    private caseName: string | undefined;
    private caseNumber: string | undefined;
    private conferenceId: string | undefined;
    private hearingId: string | undefined;
    private participants: ParticipantDetailsResponse[] | undefined;
    private scheduledDateTime: string | undefined;
    private userPasswords: Dictionary<string>;
    private endpoints: EndpointResponse[] | undefined;

    getCaseName(): string {
        return this.caseName;
    }

    getCaseNumber(): string {
        return this.caseNumber;
    }

    getHearingId(): string {
        return this.hearingId;
    }

    getConferenceId(): string {
        return this.conferenceId;
    }

    getScheduledDateTime(): string {
        return this.scheduledDateTime;
    }

    getParticipants(): ParticipantDetailsResponse[] {
        return this.participants;
    }

    getParticipantPassword(username: string) {
        return this.userPasswords.getItem(username);
    }

    getEndpoints() {
        return this.endpoints;
    }

    toText(): string {
        let text = '';
        text = text + `${this.caseName}\n`;
        text = text + `${this.caseNumber}\n`;
        text = text + `${this.scheduledDateTime}\n`;
        text = text + `\n`;
        text = text + `Hearing ID: ${this.hearingId}\n`;
        text = text + `Conference ID: ${this.conferenceId}\n`;
        text = text + `\n`;
        this.participants.forEach(participant => {
            text = text + `${participant.username}\n`;
            text = text + `${this.userPasswords.getItem(participant.username)}\n`;
            text = text + `\n`;
        });
        this.endpoints.forEach(endpoint => {
            text = text + `${endpoint.display_name}\n`;
            text = text + `${endpoint.sip}\n`;
            text = text + `${endpoint.pin}\n`;
            text = text + `\n`;
        });
        return text;
    }
}
