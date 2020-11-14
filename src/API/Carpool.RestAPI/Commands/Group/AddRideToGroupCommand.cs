﻿using System;
using MediatR;
using Newtonsoft.Json;

namespace Carpool.RestAPI.Commands.Group
{
	public class AddRideToGroupCommand : IRequest
	{
		[JsonConstructor]
		public AddRideToGroupCommand(Guid rideId, Guid groupId)
		{
			RideId = rideId;
			GroupId = groupId;
		}

		public Guid RideId { get; set; }
		public Guid GroupId { get; set; }
	}
}