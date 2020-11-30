using System;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class UserDetailsResponseBuilder
    {
        private readonly UserDetailsResponse _response;

        public UserDetailsResponseBuilder()
        {
            _response = new UserDetailsResponse()
            {
                Application = AllocationData.APPLICATION,
                Created_date = DateTime.UtcNow,
                First_name = UserData.FIRST_NAME,
                Id = Guid.NewGuid(),
                Is_prod_user = UserData.IS_PROD_USER,
                Number = UserData.NUMBER,
                Test_type = AllocationData.TEST_TYPE
            };
        }

        public UserDetailsResponseBuilder Judge()
        {
            _response.Contact_email = $"{UserData.JUDGE}{UserData.CONTACT_EMAIL_STEM}";
            _response.Display_name = UserData.JUDGE;
            _response.Last_name = UserData.JUDGE;
            _response.User_type = UserType.Judge;
            _response.Username = $"{UserData.JUDGE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDetailsResponseBuilder Individual()
        {
            _response.Contact_email = $"{UserData.INDIVIDUAL}{UserData.CONTACT_EMAIL_STEM}";
            _response.Display_name = UserData.INDIVIDUAL;
            _response.Last_name = UserData.INDIVIDUAL;
            _response.User_type = UserType.Individual;
            _response.Username = $"{UserData.INDIVIDUAL}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDetailsResponseBuilder Representative()
        {
            _response.Contact_email = $"{UserData.REPRESENTATIVE}{UserData.CONTACT_EMAIL_STEM}";
            _response.Display_name = UserData.REPRESENTATIVE;
            _response.Last_name = UserData.REPRESENTATIVE;
            _response.User_type = UserType.Representative;
            _response.Username = $"{UserData.REPRESENTATIVE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDetailsResponse Build()
        {
            return _response;
        }
    }
}
