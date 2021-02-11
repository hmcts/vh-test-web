import { Application } from 'src/app/services/clients/api-client';
import { HearingData } from './data/hearing-data';
import { UserModel } from './user.model';

export class HearingModel {
    constructor() {
        this.application = Application.VideoWeb;
        this.case_type = HearingData.CaseType;
        this.users = [];
        this.venue = HearingData.Venue;
    }

    application: Application | undefined;
    audio_recording_required?: boolean;
    case_type: string | undefined;
    created_by: string | undefined;
    custom_case_name_prefix: string | undefined;
    endpoints: number | undefined;
    questionnaire_not_required: boolean;
    scheduled_date_time?: Date | undefined;
    test_type: string | undefined;
    users: UserModel[] | undefined;
    venue: string | undefined;
}
