using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
using TestApi.Client;
using TestApi.Contract.Requests;
using TestApi.Contract.Responses;

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
        [OpenApiOperation("AllocateSingleUser")]
        [ProducesResponseType(typeof(UserDetailsResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AllocateSingleUser(AllocateUserRequest request)
        {
            _logger.LogDebug("AllocateSingleUser {userType} {application}", request.UserType, request.Application);

            try
            {
                var response = await _testApiClient.AllocateSingleUserAsync(request);
                _logger.LogDebug("User '{username}' successfully allocated", response.Username);
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to allocate user: {userType}", request.UserType);
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Allocate multiple users
        /// </summary>
        /// <param name="request">Allocate users request</param>
        /// <returns>Full details of an allocated users</returns>
        [HttpPatch("allocateUsers")]
        [OpenApiOperation("AllocateUsers")]
        [ProducesResponseType(typeof(List<UserDetailsResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> AllocateUsers(AllocateUsersRequest request)
        {
            _logger.LogDebug("AllocateUsers No. of UserTypes: {count} Application: {application}", request.UserTypes.Count, request.Application);

            try
            {
                var response = await _testApiClient.AllocateMultipleUsersAsync(request);
                _logger.LogDebug("'{count}' users successfully allocated", response.Count);
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to allocate users: {userTypes}", request.UserTypes);
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Unallocate users by username
        /// </summary>
        /// <param name="request">List of usernames to unallocate</param>
        /// <returns>Allocation details of the unallocated users</returns>
        [HttpPatch("unallocateUsers")]
        [OpenApiOperation("UnallocateUsers")]
        [ProducesResponseType(typeof(List<AllocationDetailsResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> UnallocateUsersByUsername(UnallocateUsersRequest request)
        {
            _logger.LogDebug("UnallocateUsersByUsername");

            try
            {
                var response = await _testApiClient.UnallocateUsersAsync(request);
                _logger.LogInformation("Unallocated {count} user(s)", response.Count);
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to unallocate users: {usernames}", request.Usernames);
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Get allocated users by allocatedBy
        /// </summary>
        /// <param name="username">Username of the user that has allocated users</param>
        /// <returns>Full details of any allocated users</returns>
        [HttpGet("allocatedUsers/{username}")]
        [OpenApiOperation("GetAllocatedUsers")]
        [ProducesResponseType(typeof(List<AllocationDetailsResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetAllocatedUsers(string username)
        {
            try
            {
                var response = await _testApiClient.GetAllocateUsersByAllocatedByAsync(username);
                _logger.LogInformation("Allocated to {count} user(s)", response.Count);
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to retrieve allocated users with username: {username}", username);
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
