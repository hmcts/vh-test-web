using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestWeb.Common.Security;
using TestWeb.TestApi.Client;

namespace TestWeb.Controllers
{
    [Consumes("application/json")]
    [Produces("application/json")]
    [Route("users")]
    [Authorize(AppRoles.QA)]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ITestApiClient _testApiClient;
        private readonly ILogger<UserController> _logger;

        public UserController(ITestApiClient testApiClient, ILogger<UserController> logger)
        {
            _testApiClient = testApiClient;
            _logger = logger;
        }

        /// <summary>
        ///     Reset user password
        /// </summary>
        /// <param name="request">Details of the user to reset</param>
        /// <returns>Password of the reset user</returns>
        [HttpPatch("password")]
        [ProducesResponseType(typeof(UpdateUserResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ResetPasswordAsync(ResetUserPasswordRequest request)
        {
            _logger.LogDebug($"ResetPasswordAsync {request.Username}");

            try
            {
                var response = await _testApiClient.PasswordAsync(request);
                _logger.LogDebug($"User '{request.Username}' successfully reset");
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to reset user password: ${request.Username}");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
