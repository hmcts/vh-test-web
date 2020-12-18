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
    [Route("conferences")]
    [Authorize(AppRoles.QA)]
    [ApiController]
    public class ConferencesController : ControllerBase
    {
        private readonly ITestApiClient _testApiClient;
        private readonly ILogger<ConferencesController> _logger;

        public ConferencesController(ITestApiClient testApiClient, ILogger<ConferencesController> logger)
        {
            _testApiClient = testApiClient;
            _logger = logger;
        }

        /// <summary>
        ///     Create video event
        /// </summary>
        /// <param name="request">Conference event request</param>
        /// <returns></returns>
        [HttpPost("events", Name = nameof(CreateVideoEventAsync))]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> CreateVideoEventAsync(ConferenceEventRequest request)
        {
            _logger.LogDebug($"CreateVideoEventAsync");

            try
            {
                await _testApiClient.CreateVideoEventAsync(request);
                return NoContent();
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to create event: ${request.Event_type}");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
