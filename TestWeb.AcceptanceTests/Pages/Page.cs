using System;
using System.Collections.Generic;

namespace TestWeb.AcceptanceTests.Pages
{
    public class Page
    {
        public string Name { get; }
        public string Url { get; }

        private Page(string name, string url)
        {
            Name = name;
            Url = url;
        }

        public static readonly Page Login = new Page("Login", "login.microsoftonline.com");
        public static readonly Page CreateHearings = new Page("Create Hearings", "create-hearings");
        public static readonly Page DeleteHearings = new Page("Delete Hearings", "delete-hearings");
        public static readonly Page Events = new Page("Events", "events");
        public static readonly Page AllocateUsers = new Page("Allocate Users", "allocate-users");
        public static readonly Page NotFound = new Page("Not Found", "not-found");
        public static readonly Page Unauthorised = new Page("Unauthorised", "unauthorised");

        public string ToString(Page page)
        {
            return page.Name;
        }

        public static Page FromString(string name)
        {
            foreach (var page in Values)
            {
                if (page.Name.ToLower().Equals(name.ToLower()))
                {
                    return page;
                }
            }
            throw new ArgumentOutOfRangeException($"No page found with name '{name}'");
        }

        private static IEnumerable<Page> Values
        {
            get
            {
                yield return Login;
                yield return CreateHearings;
                yield return DeleteHearings;
                yield return Events;
                yield return AllocateUsers;
                yield return NotFound;
                yield return Unauthorised;
            }
        }
    }
}
