﻿namespace TestWeb.Contracts.Responses
{
    /// <summary>
    /// Configuration to initialise the UI application
    /// </summary>
    public class ClientSettingsResponse
    {
        /// <summary>
        /// The Azure Tenant Id
        /// </summary>
        public string TenantId { get; set; }

        /// <summary>
        /// The UI Client Id
        /// </summary>
        public string ClientId { get; set; }

        /// <summary>
        /// The Uri to redirect back to after a successful login
        /// </summary>
        public string RedirectUri { get; set; }

        /// <summary>
        /// The Uri to redirect back to after a successful logout
        /// </summary>
        public string PostLogoutRedirectUri { get; set; }

        /// <summary>
        /// The uri for the test api
        /// </summary>
        public string TestApiUrl { get; set; }

        /// <summary>
        /// The application insight instrumentation key
        /// </summary>
        public string AppInsightsInstrumentationKey { get; set; }

        /// <summary>
        /// The Authority
        /// </summary>
        public string Authority { get; set; }
    }
}
