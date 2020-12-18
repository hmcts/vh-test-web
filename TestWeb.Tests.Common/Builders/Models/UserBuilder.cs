using System;
using TestWeb.TestApi.Client;
using TestWeb.Tests.Common.Data;

namespace TestWeb.Tests.Common.Builders.Models
{
    public class UserBuilder
    {
        private readonly User _user;

        public UserBuilder()
        {
            _user = new User()
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

        public UserBuilder Judge()
        {
            _user.Contact_email = $"{UserData.JUDGE}{UserData.CONTACT_EMAIL_STEM}";
            _user.Display_name = UserData.JUDGE;
            _user.Last_name = UserData.JUDGE;
            _user.User_type = UserType.Judge;
            _user.Username = $"{UserData.JUDGE}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserBuilder Individual()
        {
            _user.Contact_email = $"{UserData.INDIVIDUAL}{UserData.CONTACT_EMAIL_STEM}";
            _user.Display_name = UserData.INDIVIDUAL;
            _user.Last_name = UserData.INDIVIDUAL;
            _user.User_type = UserType.Individual;
            _user.Username = $"{UserData.INDIVIDUAL}{UserData.USERNAME_STEM}";
            return this;
        }

        public UserBuilder Representative()
        {
            _user.Contact_email = $"{UserData.REPRESENTATIVE}{UserData.CONTACT_EMAIL_STEM}";
            _user.Display_name = UserData.REPRESENTATIVE;
            _user.Last_name = UserData.REPRESENTATIVE;
            _user.User_type = UserType.Representative;
            _user.Username = $"{UserData.REPRESENTATIVE}{UserData.USERNAME_STEM}";
            return this;
        }

        public User Build()
        {
            return _user;
        }
    }
}
