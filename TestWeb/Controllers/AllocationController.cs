using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestWeb.TestApi.Client;

namespace TestWeb.Controllers
{
    [Consumes("application/json")]
    [Produces("application/json")]
    [Route("allocations")]
    [ApiController]
    public class AllocationController : ControllerBase
    {
        private readonly ITestApiClient _testApiClient;
        private readonly ILogger<AllocationController> _logger;

        public AllocationController(ITestApiClient testApiClient, ILogger<AllocationController> logger)
        {
            _testApiClient = testApiClient;
            _logger = logger;
        }

        /// <summary>
        ///     Allocate single user
        /// </summary>
        /// <param name="request">Details of the required allocation</param>
        /// <returns>Full details of an allocated user</returns>
        [HttpPatch("allocateUser")]
        [ProducesResponseType(typeof(UserDetailsResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AllocateSingleUserAsync(AllocateUserRequest request)
        {
            _logger.LogDebug($"AllocateSingleUserAsync {request.User_type} {request.Application}");

            try
            {
                var response = await _testApiClient.AllocateUserAsync(request);
                _logger.LogDebug($"User '{response.Username}' successfully allocated");
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to allocate user: ${request.User_type}");
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Allocate multiple users
        /// </summary>
        /// <param name="request">Allocate users request</param>
        /// <returns>Full details of an allocated users</returns>
        [HttpPatch("allocateUsers")]
        [ProducesResponseType(typeof(List<UserDetailsResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AllocateUsersAsync(AllocateUsersRequest request)
        {
            _logger.LogDebug($"AllocateUsersAsync No. of UserTypes: {request.User_types.Count} Application: {request.Application}");

            try
            {
                var response = await _testApiClient.AllocateUsersAsync(request);
                _logger.LogDebug($"'{response.Count}' users successfully allocated");
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to allocate users: ${request.User_types}");
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Unallocate users by username
        /// </summary>
        /// <param name="request">List of usernames to unallocate</param>
        /// <returns>Allocation details of the unallocated users</returns>
        [HttpPatch("unallocateUsers")]
        [ProducesResponseType(typeof(List<AllocationDetailsResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> UnallocateUsersByUsernameAsync(UnallocateUsersRequest request)
        {
            _logger.LogDebug("UnallocateUsersByUsernameAsync");

            try
            {
                var response = await _testApiClient.UnallocateUsersAsync(request);
                _logger.LogInformation($"Unallocated {response.Count} user(s)");
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to unallocate users: ${request.Usernames}");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
