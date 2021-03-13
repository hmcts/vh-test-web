using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
using Polly;
using TestApi.Client;
using TestApi.Contract.Requests;
using UserApi.Contract.Responses;

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
        [OpenApiOperation("ResetPassword")]
        [ProducesResponseType(typeof(UpdateUserResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ResetPassword(ResetUserPasswordRequest request)
        {
            _logger.LogDebug("ResetPassword {username}", request.Username);

            const int POLLY_RETRIES = 5;

            var policy = Policy
                .HandleResult(false)
                .WaitAndRetryAsync(POLLY_RETRIES, retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));

            try
            {
                var response = await policy.ExecuteAsync(async () => await _testApiClient.GetUserExistsInAdAsync(request.Username));
                if (response.Equals(false))
                {
                    return NotFound();
                }

                _logger.LogDebug("User '{username}' successfully found in AAD", request.Username);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to find user {username} to reset user password with error '{message}'", request.Username, e.Message);
                return StatusCode(e.StatusCode, e.Response);
            }

            try
            {
                var response = await _testApiClient.ResetUserPasswordAsync(request);
                _logger.LogDebug("User '{username}' successfully reset", request.Username);
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to reset user password: {username} with error '{message}'", request.Username, e.Message);
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
