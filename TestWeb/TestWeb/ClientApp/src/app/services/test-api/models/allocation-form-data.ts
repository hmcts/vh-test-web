import { Application, TestType, UserType } from '../../clients/api-client';

export class AllocationFormData {
    constructor() {
        this.application = Application.VideoWeb;
    }

    application: Application | undefined;
    expiry_in_minutes: number | undefined;
    is_ejud: boolean;
    userType: UserType | undefined;
    testType: TestType | undefined;
}
