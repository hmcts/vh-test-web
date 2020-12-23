import { Application, TestType } from '../../clients/api-client';

export class HearingFormData {
    constructor() {
        this.application = Application.VideoWeb;
    }

    application: Application | undefined;
    audioRecordingRequired?: boolean;
    hearingDate: string | number | Date;
    hearingStartTimeHour: number | undefined;
    hearingStartTimeMinute: number | undefined;
    individuals: number | undefined;
    numberOfHearings: number | undefined;
    observers: number | undefined;
    panelMembers: number | undefined;
    questionnaireNotRequired: boolean;
    representatives: number | undefined;
    scheduledDateTime?: Date | undefined;
    testType: TestType | undefined;
}
