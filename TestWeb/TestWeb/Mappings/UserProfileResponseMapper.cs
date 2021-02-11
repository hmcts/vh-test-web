using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using TestWeb.Common.Security;
using TestWeb.Contracts.Responses;

namespace TestWeb.Mappings
{
    public static class UserProfileResponseMapper
    {
        public static UserProfileResponse MapUserToResponseModel(ClaimsPrincipal user)
        {
            var response = new UserProfileResponse
            {
                Username = user.Identity?.Name?.ToLower().Trim()
            };
            var roleClaims = user.Claims.Where(c => c.Type == ClaimTypes.Role).ToList();
            response.Role = DetermineRoleFromClaims(roleClaims);
            return response;
        }

        private static string DetermineRoleFromClaims(List<Claim> roleClaims)
        {
            if (roleClaims.Exists(x => x.Value == AppRoles.QA))
            {
                return AppRoles.QA;
            }

            throw new NotSupportedException($"Role is not supported for this application");
        }
    }
}
