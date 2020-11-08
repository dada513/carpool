﻿using System;
using System.Security.AccessControl;

namespace Carpool.Core.Models.Intersections
{
	public class UserGroup
	{
		public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid GroupId { get; set; }
		public Group Group { get; set; }
	}
}