using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using TestApi.Client;
using TestWeb.Contracts.Responses;
using TestWeb.Mappings;
using VideoApi.Contract.Requests;

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
                await _testApiClient.CreateEventAsync(request);
                return NoContent();
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to create event: ${request.EventType}");
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
                var conferences = ConferencesResponseMapper.Map(conferencesResponse);
                return Ok(conferences);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to fetch conferences");
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Get the details of a conference by hearing ref id
        /// </summary>
        /// <param name="hearingRefId">Hearing ref Id of the conference</param>
        /// <returns>Full details of a conference</returns>
        [HttpGet("hearings/{hearingRefId}", Name = nameof(GetConferenceByHearingRefIdAsync))]
        [ProducesResponseType(typeof(ConferenceResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetConferenceByHearingRefIdAsync(Guid hearingRefId)
        {
            _logger.LogDebug($"GetConferenceByHearingRefIdAsync {hearingRefId}");

            try
            {
                var conferenceResponse = await _testApiClient.GetConferenceByHearingRefIdAsync(hearingRefId);
                var conferences = ConferenceResponseMapper.Map(conferenceResponse);
                return Ok(conferences);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, $"Unable to fetch conference");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
