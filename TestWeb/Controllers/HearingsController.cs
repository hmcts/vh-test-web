using System;
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
    [Route("hearings")]
    [Authorize(AppRoles.QA)]
    [ApiController]
    public class HearingsController : ControllerBase
    {
        private readonly ITestApiClient _testApiClient;
        private readonly ILogger<HearingsController> _logger;

        public HearingsController(ITestApiClient testApiClient, ILogger<HearingsController> logger)
        {
            _testApiClient = testApiClient;
            _logger = logger;
        }

        /// <summary>
        ///     Create a hearing
        /// </summary>
        /// <param name="request">Details on the new hearing</param>
        /// <returns>Full details of created hearing</returns>
        [HttpPost]
        [ProducesResponseType(typeof(HearingDetailsResponse), (int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> CreateHearingAsync(CreateHearingRequest request)
        {
            _logger.LogDebug("CreateHearingAsync");

            try
            {
                var response = await _testApiClient.HearingsAsync(request);
                _logger.LogDebug($"New Hearing Created with id {response.Id}");
                return Created(nameof(CreateHearingAsync), response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to create hearing");
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///     Confirm hearing by id
        /// </summary>
        /// <param name="hearingId">Id of the hearing</param>
        /// <param name="request">Update the booking status details</param>
        /// <returns>Confirm a hearing</returns>
        [HttpPatch("{hearingId}", Name = nameof(ConfirmHearingByIdAsync))]
        [ProducesResponseType(typeof(ConferenceDetailsResponse), (int)HttpStatusCode.Created)]
        [ProducesResponseType((int)HttpStatusCode.NotFound)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> ConfirmHearingByIdAsync(Guid hearingId, UpdateBookingStatusRequest request)
        {
            _logger.LogDebug($"ConfirmHearingByIdAsync {hearingId}");

            try
            {
                var response = await _testApiClient.ConfirmHearingByIdAsync(hearingId, request);
                _logger.LogDebug($"Hearing confirmed with id {response.Id}");
                return Created(nameof(ConfirmHearingByIdAsync), response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to confirm hearing");
                return StatusCode(e.StatusCode, e.Response);
            }
        }

        /// <summary>
        ///    Delete hearings by partial case name or number
        /// </summary>
        /// <param name="request">Partial case name or number text for the hearing</param>
        /// <returns>Number of deleted hearings or conferences</returns>
        [HttpPost("removeTestData")]
        [ProducesResponseType(typeof(DeletedResponse), (int)HttpStatusCode.OK)]
        [ProducesResponseType((int)HttpStatusCode.BadRequest)]
        public async Task<IActionResult> DeleteTestDataByPartialCaseTextAsync(DeleteTestHearingDataRequest request)
        {
            _logger.LogDebug($"DeleteHearingsByPartialCaseTextAsync");

            try
            {
                var response = await _testApiClient.RemoveTestDataAsync(request);
                _logger.LogDebug($"{response} hearings deleted");
                return Ok(response);
            }
            catch (TestApiException e)
            {
                _logger.LogError(e, "Unable to delete hearing and/or conference");
                return StatusCode(e.StatusCode, e.Response);
            }
        }
    }
}
