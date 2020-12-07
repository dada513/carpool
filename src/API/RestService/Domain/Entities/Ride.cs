﻿using System;
using System.Collections.Generic;
using Domain.Abstract;
using Domain.Entities.Intersections;
using Domain.Enums;
using Domain.ValueObjects;
using IdentifiersShared.Identifiers;

namespace Domain.Entities
{
	public class Ride : BaseEntity<RideId>
	{
		public AppUserId OwnerId { get; set; }
		public ApplicationUser Owner { get; set; }

		public List<UserParticipatedRide> Participants { get; set; }

		public GroupId GroupId { get; set; }

		public Group Group { get; set; }

		public DateTime Date { get; set; }

		public double Price { get; set; }

		public Location Location { get; set; }

		public RideDirection RideDirection { get; set; }
		public List<Stop> Stops { get; set; }
	}
}