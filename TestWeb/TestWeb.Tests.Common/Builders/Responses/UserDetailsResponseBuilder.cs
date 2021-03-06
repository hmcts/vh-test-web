using System;
using TestApi.Contract.Enums;
using TestApi.Contract.Responses;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Responses
{
    public class UserDetailsResponseBuilder
    {
        private readonly UserDetailsResponse _response;

        public UserDetailsResponseBuilder()
        {
            _response = new UserDetailsResponse
            {
                Application = AllocationData.APPLICATION,
                CreatedDate = DateTime.UtcNow,
                FirstName = UserData.FIRST_NAME,
                Id = Guid.NewGuid(),
                IsProdUser = UserData.IS_PROD_USER,
                Number = UserData.NUMBER,
                TestType = AllocationData.TEST_TYPE
            };
        }

        public UserDetailsResponseBuilder Judge()
        {
            _response.ContactEmail = $"{UserData.JUDGE}{UserData.CONTACT_EMAIL_STEM}";
            _response.DisplayName = UserData.JUDGE;
            _response.LastName = UserData.JUDGE;
            _response.UserType = UserType.Judge;
            _response.Username = $"{UserData.JUDGE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDetailsResponseBuilder Individual()
        {
            _response.ContactEmail = $"{UserData.INDIVIDUAL}{UserData.CONTACT_EMAIL_STEM}";
            _response.DisplayName = UserData.INDIVIDUAL;
            _response.LastName = UserData.INDIVIDUAL;
            _response.UserType = UserType.Individual;
            _response.Username = $"{UserData.INDIVIDUAL}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDetailsResponseBuilder Representative()
        {
            _response.ContactEmail = $"{UserData.REPRESENTATIVE}{UserData.CONTACT_EMAIL_STEM}";
            _response.DisplayName = UserData.REPRESENTATIVE;
            _response.LastName = UserData.REPRESENTATIVE;
            _response.UserType = UserType.Representative;
            _response.Username = $"{UserData.REPRESENTATIVE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDetailsResponse Build()
        {
            return _response;
        }
    }
}
