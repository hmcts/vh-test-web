using System;
using TestApi.Contract.Dtos;
using TestApi.Contract.Enums;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Models
{
    public class UserBuilder
    {
        private readonly UserDto _user;

        public UserBuilder()
        {
            _user = new UserDto
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

        public UserBuilder Judge()
        {
            _user.ContactEmail = $"{UserData.JUDGE}{UserData.CONTACT_EMAIL_STEM}";
            _user.DisplayName = UserData.JUDGE;
            _user.LastName = UserData.JUDGE;
            _user.UserType = UserType.Judge;
            _user.Username = $"{UserData.JUDGE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserBuilder Individual()
        {
            _user.ContactEmail = $"{UserData.INDIVIDUAL}{UserData.CONTACT_EMAIL_STEM}";
            _user.DisplayName = UserData.INDIVIDUAL;
            _user.LastName = UserData.INDIVIDUAL;
            _user.UserType = UserType.Individual;
            _user.Username = $"{UserData.INDIVIDUAL}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserBuilder Representative()
        {
            _user.ContactEmail = $"{UserData.REPRESENTATIVE}{UserData.CONTACT_EMAIL_STEM}";
            _user.DisplayName = UserData.REPRESENTATIVE;
            _user.LastName = UserData.REPRESENTATIVE;
            _user.UserType = UserType.Representative;
            _user.Username = $"{UserData.REPRESENTATIVE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserDto Build()
        {
            return _user;
        }
    }
}
