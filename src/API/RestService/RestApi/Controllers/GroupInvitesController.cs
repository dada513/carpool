﻿using System.Threading.Tasks;
using AutoWrapper.Wrappers;
using DataTransferObjects.GroupInvitesDtos;
using IdentifiersShared.Identifiers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RestApi.Commands.GroupInviteCommands;
using RestApi.DTOs.GroupInvites;
using RestApi.Queries.GroupInviteQueries;

namespace RestApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[Authorize]
	public class GroupInvitesController : Controller
	{
		private readonly IMediator _mediator;

		public GroupInvitesController(IMediator mediator)
			=> _mediator = mediator;

        [HttpGet("~/api/users/{appUserId}/group-invites")]
        public async Task<ApiResponse> GetUserGroupInvites([FromRoute] AppUserId appUserId)
        {
            var request = new GetUserGroupInvitesQuery(appUserId);

            var response = await _mediator.Send(request).ConfigureAwait(false);

            return new ApiResponse(response);
        }

		// GET: api/GroupInvites/5
		[HttpGet("{groupInviteId}")]
		public async Task<ApiResponse> GetGroupInvite([FromRoute] long groupInviteId)
		{
			GetGroupInviteQuery request = new(new GroupInviteId(groupInviteId));

			var response = await _mediator.Send(request).ConfigureAwait(false);

			return new ApiResponse(response);
		}

		// PUT: api/GroupInvites/5
		// To protect from overposting attacks, enable the specific properties you want to bind to, for
		// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		[HttpPut("{groupInviteId}")]
		public async Task<ApiResponse> PutGroupInvite([FromBody] UpdateGroupInviteDto model,
			[FromRoute] long groupInviteId)
		{
			GroupInviteId typedGroupInviteId = new(groupInviteId);
			UpdateGroupInviteCommand request = new(typedGroupInviteId, model.IsAccepted);

			await _mediator.Send(request).ConfigureAwait(false);

			return new ApiResponse($"Group Invite with id: {groupInviteId} has been updated", groupInviteId);
		}

		// POST: api/GroupInvites
		// To protect from overposting attacks, enable the specific properties you want to bind to, for
		// more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
		[HttpPost]
		public async Task<ApiResponse> PostGroupInvite(AddGroupInviteCommand request)
		{
			var groupInvite = await _mediator.Send(request).ConfigureAwait(false);
			return new ApiResponse($"Group Invite was created with id: {groupInvite}", groupInvite,
				StatusCodes.Status201Created);
		}

		// DELETE: api/GroupInvites/5
		[HttpDelete("{groupInviteId}")]
		public async Task<ApiResponse> DeleteGroupInvite(long groupInviteId)
		{
			GroupInviteId typedGroupInviteId = new(groupInviteId);
			var request = new DeleteGroupInviteCommand(typedGroupInviteId);
			var response = await _mediator.Send(request).ConfigureAwait(false);

			return new ApiResponse($"Group Invite with id: {response} has been deleted");
		}
    }
}