import { Application, TestType, UserType } from 'src/app/services/clients/api-client';
import { UserData } from './data/user-data';

export class UserModel {
    constructor() {
        this.application = UserData.Application;
        this.is_prod_user = UserData.IsProdUser;
    }

    username: string | undefined;
    contact_email: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    display_name: string | undefined;
    number: number | undefined;
    test_type: TestType | undefined;
    user_type: UserType | undefined;
    application: Application | undefined;
    is_prod_user: boolean;
    created_date?: Date | undefined;
}
