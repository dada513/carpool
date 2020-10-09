﻿using System;
using MediatR;

namespace Carpool.RestAPI.Commands.Rating
{
	public class AddUserRatingCommand : IRequest<Core.Models.Rating>
	{
		public AddUserRatingCommand(Guid? userId, int value)
		{
			UserId = userId;
			Value = value;
		}

		public Guid? UserId { get; set; }
		public int Value { get; set; }
	}
}