using System;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
using TestWeb.Contracts.Responses;
using TestWeb.Mappings;

namespace TestWeb.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("profile")]
    public class UserProfileController : Controller
    {
        private readonly ILogger<UserProfileController> _logger;

        public UserProfileController(ILogger<UserProfileController> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Get profile for logged in user
        /// </summary>
        /// <returns>Profile for logged in user</returns>
        [HttpGet]
        [OpenApiOperation("GetUserProfile")]
        [ProducesResponseType(typeof(UserProfileResponse), (int)HttpStatusCode.OK)]
        public IActionResult GetUserProfile()
        {
            try
            {
                var response = UserProfileResponseMapper.MapUserToResponseModel(User);
                return Ok(response);
            }
            catch (Exception e)
            {
                _logger.LogError(e, "User does not have permission. Error: '{message}'", e.Message);
                return Unauthorized();
            }
        }
    }
}
