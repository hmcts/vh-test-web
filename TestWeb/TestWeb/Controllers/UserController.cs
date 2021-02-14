using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Polly;
using TestWeb.TestApi.Client;

namespace TestWeb.Controllers
{
    [Consumes("application/json")]
    [Produces("application/json")]
    [Route("users")]
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

            const int POLLY_RETRIES = 5;

            var policy = Policy
                .HandleResult(false)
                .WaitAndRetryAsync(POLLY_RETRIES, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

            try
            {
                var response = await policy.ExecuteAsync(async () => await _testApiClient.AadAsync(request.Username));
                if (response.Equals(true))
                {
                    _logger.LogDebug($"User '{request.Username}' successfully found in AAD");
                }
                else
                {
                    return NotFound();
                }
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to find user {request.Username} to reset user password.");
                return StatusCode(e.StatusCode, e.Response);
            }

            try
            {
                var response = await _testApiClient.PasswordAsync(request);
                _logger.LogDebug($"User '{request.Username}' successfully reset");
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to reset user password: {request.Username}");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
