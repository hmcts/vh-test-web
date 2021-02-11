import { Application, TestType, UserDetailsResponse, UserType } from '../../clients/api-client';
import { MapAllocatedResponseToUser } from './map-allocated-user-details-response-to-users-model';

describe('MapAllocatedResponseToUser', () => {
    it('should map the UserDetailsResponse to the UserModel', () => {
        const userDetails = new UserDetailsResponse();
        userDetails.application = Application.AdminWeb;
        userDetails.contact_email = 'test.user@email.com';
        userDetails.created_date = new Date();
        userDetails.display_name = 'test user';
        userDetails.first_name = 'test';
        userDetails.is_prod_user = false;
        userDetails.last_name = 'user';
        userDetails.number = 1;
        userDetails.test_type = TestType.Manual;
        userDetails.user_type = UserType.CaseAdmin;
        userDetails.username = 'user.test@email.net';

        const response = MapAllocatedResponseToUser.map(userDetails);
        expect(response.application).toBe(userDetails.application);
        expect(response.contact_email).toBe(userDetails.contact_email);
        expect(response.created_date).toBe(userDetails.created_date);
        expect(response.display_name).toBe(userDetails.display_name);
        expect(response.first_name).toBe(userDetails.first_name);
        expect(response.last_name).toBe(userDetails.last_name);
        expect(response.is_prod_user).toBe(userDetails.is_prod_user);
        expect(response.number).toBe(userDetails.number);
        expect(response.test_type).toBe(userDetails.test_type);
        expect(response.username).toBe(userDetails.username);
        expect(response.user_type).toBe(userDetails.user_type);
    });
});
