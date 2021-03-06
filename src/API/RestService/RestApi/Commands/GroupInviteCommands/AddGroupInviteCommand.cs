﻿using System;
using System.Threading;
using System.Threading.Tasks;
using DataAccessLayer.Repositories;
using Domain.Contracts;
using Domain.Contracts.Repositories;
using Domain.Entities;
using IdentifiersShared.Generator;
using IdentifiersShared.Identifiers;
using IdGen;
using MediatR;
using Newtonsoft.Json;

namespace RestApi.Commands.GroupInviteCommands
{
	public class AddGroupInviteCommand : IRequest<GroupInviteId>
	{
		[JsonConstructor]
		public AddGroupInviteCommand(GroupId groupId, AppUserId invitedAppUserId, AppUserId inviterId)
		{
			GroupId = groupId;
			InvitedAppUserId = invitedAppUserId;
			InviterId = inviterId;
		}

		public GroupId GroupId { get; set; }

		public AppUserId InvitedAppUserId { get; set; }

		public AppUserId InviterId { get; set; }
	}
	
	public class AddGroupInviteCommandHandler : IRequestHandler<AddGroupInviteCommand, GroupInviteId>
	{
		private readonly IGroupInviteRepository _groupInviteRepository;
		private readonly IUnitOfWork _unitOfWork;

		public AddGroupInviteCommandHandler(IGroupInviteRepository groupInviteRepository, IUnitOfWork unitOfWork)
			=> (_groupInviteRepository, _unitOfWork)
				= (groupInviteRepository, unitOfWork);

		public async Task<GroupInviteId> Handle(AddGroupInviteCommand request,
			CancellationToken cancellationToken)
		{
			IdGenerator idGenerator = new IdGenerator(IdGeneratorType.GroupInvite);
			var groupInvite = new GroupInvite
			{
				Id = new GroupInviteId(idGenerator.CreateId()),
				InvitingAppUserId = request.InviterId,
				InvitedAppUserId = request.InvitedAppUserId,
				IsAccepted = false,
				IsPending = true,
				DateAdded = DateTime.Now,
				GroupId = request.GroupId
			};

			await _groupInviteRepository.AddAsync(groupInvite, cancellationToken);
			await _unitOfWork.SaveAsync(cancellationToken);

			return groupInvite.Id;
		}
	}
}