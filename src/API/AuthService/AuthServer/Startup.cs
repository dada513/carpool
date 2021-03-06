using Auth.DataAccessLayer.DatabaseContexts;
using AuthDomain.Entities;
using AuthServer.Services;
using AutoWrapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using RestEase;

namespace AuthServer
{
	public class Startup
	{
		public Startup(IConfiguration configuration) => Configuration = configuration;

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.AddCors();

			services.AddDbContext<ApplicationDbContext>(options =>
			{
				options.UseSqlServer(Configuration.GetConnectionString("IdentityDbConnectionString"));
			});

			services.AddIdentity<AuthUser, IdentityRole>()
				.AddEntityFrameworkStores<ApplicationDbContext>()
				.AddDefaultTokenProviders();

			services.AddTransient(_ => RestClient.For<IUserManagementService>("https://carpool-rest.azurewebsites.net"));

			services.AddControllers();
			services.AddSwaggerGen(c =>
			{
				c.SwaggerDoc("v1", new OpenApiInfo {Title = "AuthServer", Version = "v1"});
			});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
				app.UseDeveloperExceptionPage();

			app.UseSwagger();
			app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AuthServer v1"));

			app.UseHttpsRedirection();

			app.UseRouting();
			
			app.UseCors(x =>
			{
				x.AllowAnyMethod()
					.AllowAnyHeader()
					.SetIsOriginAllowed(origin => true); // allow any origin
			});
			
			app.UseApiResponseAndExceptionWrapper();

			app.UseStaticFiles();

			app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
		}
	}
}