﻿using System;
using System.Collections.Generic;
using Domain.Abstract;
using Domain.Entities.Intersections;
using Domain.ValueObjects;

namespace Domain.Entities
{
	public class Group : BaseEntity<Guid>
	{
		public IReadOnlyList<UserGroup> UserGroups { get; set; }

		public Location Location { get; set; }

		public IReadOnlyList<Ride> Rides { get; set; }

		public string Name { get; set; }

		public string Code { get; set; }
		public ApplicationUser Owner { get; set; }
		public Guid OwnerId { get; set; }
	}
}