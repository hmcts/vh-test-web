﻿using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using NSwag.Annotations;
using TestWeb.Common.Configuration;
using TestWeb.Contracts.Responses;
using TestWeb.Mappings;

namespace TestWeb.Controllers
{
    [Produces("application/json")]
    [ApiController]
    [Route("config")]
    public class ConfigSettingsController : Controller
    {
        private readonly AzureAdConfiguration _azureAdConfiguration;
        private readonly HearingServicesConfiguration _servicesConfiguration;

        public ConfigSettingsController(IOptions<AzureAdConfiguration> azureAdConfiguration, IOptions<HearingServicesConfiguration> servicesConfiguration)
        {
            _azureAdConfiguration = azureAdConfiguration.Value;
            _servicesConfiguration = servicesConfiguration.Value;
        }

        /// <summary>
        /// Get the configuration settings for client
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [OpenApiOperation("GetClientConfigurationSettings")]
        [ProducesResponseType(typeof(ClientSettingsResponse), (int)HttpStatusCode.OK)]
        public ActionResult<ClientSettingsResponse> GetClientConfigurationSettings()
        {
            var response = ClientSettingsResponseMapper.MapAppConfigurationToResponseModel(_azureAdConfiguration, _servicesConfiguration);
            return Ok(response);
        }
    }
}