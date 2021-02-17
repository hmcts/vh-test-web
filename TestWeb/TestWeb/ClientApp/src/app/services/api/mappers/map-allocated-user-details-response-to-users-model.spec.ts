import { Application, TestType, UserDetailsResponse, UserType } from '../../clients/api-client';
import { MapAllocatedResponseToUsers } from './map-allocated-users-details-response-to-users-model';

describe('MapAllocatedResponseToUsers', () => {
    const mapper = new MapAllocatedResponseToUsers();

    it('should map the UserDetailsResponse to the UserModel', () => {
        const userDetailsResponse = [];
        let userDetails = new UserDetailsResponse();
        userDetails.application = Application.AdminWeb;
        userDetails.contact_email = 'test.user@hmcts.net';
        userDetails.created_date = new Date();
        userDetails.display_name = 'test user';
        userDetails.first_name = 'test';
        userDetails.is_prod_user = false;
        userDetails.last_name = 'user';
        userDetails.number = 1;
        userDetails.test_type = TestType.Manual;
        userDetails.user_type = UserType.CaseAdmin;
        userDetails.username = 'user.test@email.net';
        userDetailsResponse.push(userDetails);

        userDetails = new UserDetailsResponse();
        userDetails.application = Application.AdminWeb;
        userDetails.contact_email = 'test.user1@hmcts.net';
        userDetails.created_date = new Date();
        userDetails.display_name = 'test user1';
        userDetails.first_name = 'test';
        userDetails.is_prod_user = false;
        userDetails.last_name = 'user1';
        userDetails.number = 1;
        userDetails.test_type = TestType.Manual;
        userDetails.user_type = UserType.CaseAdmin;
        userDetails.username = 'user.test1@email.net';
        userDetailsResponse.push(userDetails);

        const response = MapAllocatedResponseToUsers.map(userDetailsResponse);
        expect(response[0].application).toBe(userDetailsResponse[0].application);
        expect(response[0].contact_email).toBe(userDetailsResponse[0].contact_email);
        expect(response[0].created_date).toBe(userDetailsResponse[0].created_date);
        expect(response[0].display_name).toBe(userDetailsResponse[0].display_name);
        expect(response[0].first_name).toBe(userDetailsResponse[0].first_name);
        expect(response[0].last_name).toBe(userDetailsResponse[0].last_name);
        expect(response[0].is_prod_user).toBe(userDetailsResponse[0].is_prod_user);
        expect(response[0].number).toBe(userDetailsResponse[0].number);
        expect(response[0].test_type).toBe(userDetailsResponse[0].test_type);
        expect(response[0].username).toBe(userDetailsResponse[0].username);
        expect(response[0].user_type).toBe(userDetailsResponse[0].user_type);
    });
});
