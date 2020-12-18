using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.TestHost;
using NUnit.Framework;
using TestWeb.IntegrationTests.Test;
using TestContext = TestWeb.IntegrationTests.Test.TestContext;

namespace TestWeb.IntegrationTests.Controllers
{
    public class ControllerTestsBase
    {
        protected TestContext Context;
        protected HttpResponseMessage Response;
        protected string Json;
        private TestServer _server;

        [OneTimeSetUp]
        public async Task BeforeTestRun()
        {
            Context = await new Setup().RegisterSecrets();
            _server = Context.Server;
        }

        [TearDown]
        public async Task AfterEveryTest()
        {
            // Data Cleanup
        }

        [OneTimeTearDown]
        public void AfterTestRun()
        {
            _server?.Dispose();
        }

        private HttpClient CreateNewClient()
        {
            var client = _server.CreateClient();
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {Context.Token}");
            return client;
        }

        protected async Task SendGetRequest(string uri)
        {
            using var client = CreateNewClient();
            Response = await client.GetAsync(uri);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendPatchRequest(string uri, string request)
        {
            var content = new StringContent(request, Encoding.UTF8, "application/json");
            using var client = CreateNewClient();
            Response = await client.PatchAsync(uri, content);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendPostRequest(string uri, string request)
        {
            var content = new StringContent(request, Encoding.UTF8, "application/json");
            using var client = CreateNewClient();
            Response = await client.PostAsync(uri, content);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendPutRequest(string uri, string request)
        {
            var content = new StringContent(request, Encoding.UTF8, "application/json");
            using var client = CreateNewClient();
            Response = await client.PutAsync(uri, content);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected async Task SendDeleteRequest(string uri)
        {
            using var client = CreateNewClient();
            Response = await client.DeleteAsync(uri);
            Json = await Response.Content.ReadAsStringAsync();
        }

        protected void VerifyResponse(HttpStatusCode statusCode, bool isSuccess)
        {
            Response.StatusCode.Should().Be(statusCode);
            Response.IsSuccessStatusCode.Should().Be(isSuccess);
        }
    }
}
