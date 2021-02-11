import { ConferenceDetailsResponse } from 'src/app/services/clients/api-client';
import Dictionary from '../helpers/dictionary';

export class ConferenceSummary {
    private conference: ConferenceDetailsResponse;
    private userPasswords: Dictionary<string>;

    constructor(conference: ConferenceDetailsResponse, userPasswords: Dictionary<string>) {
        this.conference = conference;
        this.userPasswords = userPasswords;
    }

    asText(): string {
        let text = '';
        text = text + `${this.conference.case_name}\n`;
        text = text + `${this.conference.case_number}\n`;
        text = text + `${this.conference.scheduled_date_time.toLocaleString()}\n`;
        text = text + `\n`;
        text = text + `Hearing ID: ${this.conference.hearing_id}\n`;
        text = text + `Conference ID: ${this.conference.id}\n`;
        text = text + `\n`;
        this.conference.participants.forEach(participant => {
            text = text + `${participant.username}\n`;
            text = text + `${this.userPasswords.getItem(participant.username)}\n`;
            text = text + `\n`;
        });
        return text;
    }
}
