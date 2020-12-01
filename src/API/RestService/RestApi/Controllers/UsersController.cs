﻿using System.Threading.Tasks;
using AutoWrapper.Wrappers;
using DataAccessLayer.DatabaseContexts;
using IdentifiersShared.Identifiers;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using RestApi.Commands.UserCommands;
using RestApi.DTOs.User;
using RestApi.Queries.UserQueries;

namespace RestApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UsersController : Controller
	{
		private readonly CarpoolDbContext _context;
		private readonly IMediator _mediator;

		public UsersController(CarpoolDbContext context, IMediator mediator)
		{
			_context = context;
			_mediator = mediator;
		}

		[HttpGet]
		public async Task<ApiResponse> GetUsers()
		{
			var request = new GetUsersQuery();
			var response = await _mediator.Send(request);
			return new ApiResponse(response);
		}

		[HttpGet("{userId}")]
		public async Task<ApiResponse> GetUser([FromRoute] long userId)
		{
			UserId typedUserId = new(userId);
			var request = new GetUserByIdQuery(typedUserId);
			var response = await _mediator.Send(request);

			return new ApiResponse(response);
		}

		[HttpGet("~/api/groups/{groupId}/users")]
		public async Task<ApiResponse> GetGroupUsers([FromRoute] long groupId)
		{
			GroupId typedGroupId = new(groupId);
			var request = new GetGroupUsersQuery(typedGroupId);
			var result = await _mediator.Send(request);
			return new ApiResponse(result);
		}

		[HttpPut("{userId}")]
		public async Task<ApiResponse> PutUser([FromRoute] long userId, [FromBody] UpdateUserDto model)
		{
			UserId typedUserId = new(userId);
			UpdateUserCommand request = new(typedUserId,
				model.FirstName,
				model.LastName);

			var response = await _mediator.Send(request);

			return new ApiResponse(response);
		}

		[HttpPost]
		public async Task<ApiResponse> PostUser([FromBody] AddUserCommand request)
		{
			var response = await _mediator.Send(request);
			return new ApiResponse(response);
		}

		[HttpDelete("{userId}")]
		public async Task<ApiResponse> DeleteUser([FromRoute] long userId)
		{
			UserId typedUserId = new(userId);
			var request = new DeleteUserCommand(typedUserId);

			var response = await _mediator.Send(request).ConfigureAwait(false);

			return new ApiResponse(response);
		}
	}
}