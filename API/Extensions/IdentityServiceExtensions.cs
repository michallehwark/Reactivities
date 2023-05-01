using System.Text;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authorization;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, 
            IConfiguration config)
            {
                services.AddIdentityCore<AppUser>(opt => 
                {
                    opt.Password.RequireNonAlphanumeric = false;
                    opt.User.RequireUniqueEmail = true;
                })
                .AddEntityFrameworkStores<DataContext>();

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

                services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(opt => 
                    {
                        opt.TokenValidationParameters = new TokenValidationParameters // here we specify what exactly do we want to validate     
                        {
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = key,
                            ValidateIssuer = false,
                            ValidateAudience = false
                        };
                        opt.Events = new JwtBearerEvents
                        {
                            OnMessageReceived = context =>
                            {   // because we dont make hhtpRequests in SignalR we need to get the authentication token differently
                                var accessToken = context.Request.Query["access_token"];
                                // ["access_token"] spelling here is important
                                // clinet side of SignalR will pass token in a Query string and a key for that query string will be called ["access_token"]
                                var path = context.HttpContext.Request.Path;
                                if (!string.IsNullOrEmpty(accessToken) && (path.StartsWithSegments("/chat"))) // 'chat' is the endpoint for SignalR hub
                                {
                                    context.Token = accessToken;
                                    // because of that inside out hub context we will have to this token
                                }
                                return Task.CompletedTask;
                            }
                        };
                    });

                services.AddAuthorization(opt =>{
                    opt.AddPolicy("IsActivityHost", policy =>
                    {
                        policy.Requirements.Add(new IsHostRequirement());
                    });
                });

                services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
                services.AddScoped<TokenService>();
                return services;
            }
    }
}