﻿using System;
using MediatR;
using Newtonsoft.Json;

namespace Carpool.RestAPI.Queries.User
{
	public class GetUserByIdQuery : IRequest<Core.Models.User>
	{
		[JsonConstructor]
		public GetUserByIdQuery(Guid userId)
			=> UserId = userId;

		public Guid UserId { get; set; }
	}
}