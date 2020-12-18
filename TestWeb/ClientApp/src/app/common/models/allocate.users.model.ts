import { Application, TestType, UserType } from 'src/app/services/clients/api-client';
import { UserData } from './data/user-data';

export class AllocateUsersModel {
    constructor() {
        this.application = UserData.Application;
        this.expiry_in_minutes = UserData.ExpiryInMinutes;
        this.is_prod_user = UserData.IsProdUser;
        this.usertypes = [];
    }

    application: Application | undefined;
    expiry_in_minutes: number | undefined;
    is_prod_user: boolean;
    test_type: TestType | undefined;
    usertypes: UserType[] | undefined;
}
