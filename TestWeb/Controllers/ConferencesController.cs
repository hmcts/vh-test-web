using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestWeb.Contracts.Responses;
using TestWeb.Mappings;
using TestWeb.TestApi.Client;

namespace TestWeb.Controllers
{
    [Consumes("application/json")]
    [Produces("application/json")]
    [Route("conferences")]
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

        /// <summary>
        ///    Get conferences for today
        /// </summary>
        /// <returns>Conferences for today</returns>
        [HttpGet("conferences", Name = nameof(GetConferencesForTodayAsync))]
        [ProducesResponseType(typeof(List<ConferenceResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetConferencesForTodayAsync()
        {
            _logger.LogDebug($"GetConferencesForTodayAsync");

            try
            {
                var conferencesResponse = await _testApiClient.GetConferencesForTodayVhoAsync();
                var conferences = ConferenceResponseMapper.Map(conferencesResponse);
                return Ok(conferences);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to fetch conferences");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
