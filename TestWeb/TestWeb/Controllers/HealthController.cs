using System;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TestApi.Client;
using TestWeb.Models;

namespace TestWeb.Controllers
{
    [Produces("application/json")]
    [Route("health")]
    [AllowAnonymous]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ITestApiClient _testApiClient;

        public HealthController(ITestApiClient testApiClient)
        {
            _testApiClient = testApiClient;
        }

        /// <summary>
        ///     Check Service Health
        /// </summary>
        /// <returns>Error if fails, otherwise OK status</returns>
        [HttpGet("health")]
        [HttpGet("liveness")]
        [SwaggerOperation(OperationId = "CheckServiceHealth")]
        [ProducesResponseType(typeof(HealthCheckResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType(typeof(HealthCheckResponse), (int)HttpStatusCode.InternalServerError)]
        public async Task<IActionResult> HealthAsync()
        {
            var response = new HealthCheckResponse { AppVersion = GetApplicationVersion() };

            try
            {
                await _testApiClient.CheckServiceHealthAsync();
                response.TestApiHealth.Successful = true;
            }
            catch (Exception ex)
            {
                response.TestApiHealth.Successful = false;
                response.TestApiHealth.ErrorMessage = ex.Message;
                response.TestApiHealth.Data = ex.Data;
            }

            return response.TestApiHealth.Successful 
                ? Ok(response)
                : StatusCode((int)HttpStatusCode.InternalServerError, response);
        }

        private static ApplicationVersion GetApplicationVersion()
        {
            var applicationVersion = new ApplicationVersion()
            {
                FileVersion = GetExecutingAssemblyAttribute<AssemblyFileVersionAttribute>(a => a.Version),
                InformationVersion = GetExecutingAssemblyAttribute<AssemblyInformationalVersionAttribute>(a => a.InformationalVersion)
            };
            return applicationVersion;
        }

        private static string GetExecutingAssemblyAttribute<T>(Func<T, string> value) where T : Attribute
        {
            var attribute = (T)Attribute.GetCustomAttribute(Assembly.GetExecutingAssembly(), typeof(T));
            return value.Invoke(attribute);
        }
    }
}
