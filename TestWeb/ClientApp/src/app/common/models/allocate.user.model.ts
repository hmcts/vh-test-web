import { Application, TestType, UserType } from 'src/app/services/clients/api-client';
import { UserData } from './data/user-data';

export class AllocateUserModel {
    constructor() {
        this.application = UserData.Application;
        this.expiry_in_minutes = UserData.ExpiryInMinutes;
        this.is_prod_user = UserData.IsProdUser;
    }

    allocated_by: string | undefined;
    application: Application | undefined;
    expiry_in_minutes: number | undefined;
    is_prod_user: boolean;
    test_type: TestType | undefined;
    user_type: UserType | undefined;
}
