import { UserModel } from 'src/app/common/models/user.model';
import { UserDetailsResponse } from '../../clients/api-client';

export class MapAllocatedResponseToUsers {
    public static map(userDetailsResponses: UserDetailsResponse[]): UserModel[] {
        const users = [];
        userDetailsResponses.forEach(response => {
            const user = new UserModel();
            user.application = response.application;
            user.contact_email = response.contact_email;
            user.created_date = response.created_date;
            user.display_name = response.display_name;
            user.first_name = response.first_name;
            user.is_prod_user = response.is_prod_user;
            user.last_name = response.last_name;
            user.number = response.number;
            user.test_type = response.test_type;
            user.user_type = response.user_type;
            user.username = response.username;
            users.push(user);
        });
        return users;
    }
}
