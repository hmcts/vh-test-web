using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NSwag.Annotations;
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
        [HttpPost("events", Name = nameof(CreateVideoEvent))]
        [OpenApiOperation("CreateVideoEvent")]
        [ProducesResponseType((int)HttpStatusCode.NoContent)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> CreateVideoEvent(ConferenceEventRequest request)
        {
            _logger.LogDebug("CreateVideoEvent");

            try
            {
                await _testApiClient.CreateEventAsync(request);
                return NoContent();
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to create event: {eventType}", request.EventType);
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///    Get conferences for today
        /// </summary>
        /// <returns>Conferences for today</returns>
        [HttpGet("conferences", Name = nameof(GetConferencesForTodayAsync))]
        [OpenApiOperation("GetConferencesForTodayAsync")]
        [ProducesResponseType(typeof(List<ConferenceResponse>), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetConferencesForTodayAsync()
        {
            _logger.LogDebug("GetConferencesForTodayAsync");

            try
            {
                var conferencesResponse = await _testApiClient.GetConferencesForTodayVhoAsync();
                var conferences = ConferencesResponseMapper.Map(conferencesResponse);
                return Ok(conferences);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to fetch conferences with error '{message}'", e.Message);
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Get the details of a conference by hearing ref id
        /// </summary>
        /// <param name="hearingRefId">Hearing ref Id of the conference</param>
        /// <returns>Full details of a conference</returns>
        [HttpGet("hearings/{hearingRefId}", Name = nameof(GetConferenceByHearingRefId))]
        [OpenApiOperation("GetConferenceByHearingRefId")]
        [ProducesResponseType(typeof(ConferenceResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> GetConferenceByHearingRefId(Guid hearingRefId)
        {
            _logger.LogDebug("GetConferenceByHearingRefId {hearingRefId}", hearingRefId);

            try
            {
                var conferenceResponse = await _testApiClient.GetConferenceByHearingRefIdAsync(hearingRefId);
                var conferences = ConferenceResponseMapper.Map(conferenceResponse);
                return Ok(conferences);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to fetch conference with error '{message}'", e.Message);
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
