using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TestWeb.Common.Configuration;
using TestWeb.Common.Security;

namespace TestWeb.Extensions
{
    public static class ConfigureAuthSchemeExtensions
    {
        private static string SchemeName => "Default";

        public static void RegisterAuthSchemes(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();

            serviceCollection.AddMvc(options => { options.Filters.Add(new AuthorizeFilter(policy)); });

            var securitySettings = configuration.GetSection("AzureAd").Get<AzureAdConfiguration>();

            serviceCollection.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddPolicyScheme(JwtBearerDefaults.AuthenticationScheme, SchemeName, options => options.ForwardDefaultSelector = context => SchemeName)
                .AddJwtBearer(SchemeName, options =>
                {
                    options.Authority = securitySettings.Authority + securitySettings.TenantId;
                    options.TokenValidationParameters.ValidateLifetime = true;
                    options.Audience = securitySettings.ClientId;
                    options.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
                });

            serviceCollection.AddAuthorization();

            serviceCollection.AddAuthPolicies();
        }

        private static void AddAuthPolicies(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddAuthorization(AddPolicies);
            serviceCollection.AddMvc(AddMvcPolicies);
        }

        private static void AddPolicies(AuthorizationOptions options)
        {
            var allRoles = new[] { AppRoles.QA };
            options.AddPolicy(SchemeName, new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireRole(allRoles)
                .AddAuthenticationSchemes(SchemeName)
                .Build());
        }

        private static void AddMvcPolicies(MvcOptions options)
        {
            var allRoles = new[] { AppRoles.QA };
            options.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireRole(allRoles)
                .Build()));
        }
    }
}
