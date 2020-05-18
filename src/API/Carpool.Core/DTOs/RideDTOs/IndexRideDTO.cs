﻿using Carpool.Core.DTOs.StopDTOs;
using Carpool.Core.DTOs.UserDTOs;
using Carpool.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Carpool.Core.DTOs.RideDTOs
{
	public class IndexRideDTO
	{
		public IndexUserDTO Owner { get; set; }
		public List<IndexUserDTO> Participants { get; set; }

		public List<IndexStopDTO> Stops { get; set; }

		public Location Destination { get; set; }
		public Location StartingLocation { get; set; }

		private IndexRideDTO()
		{
		}

		public static IndexRideDTO GetFromRide(Ride ride)
		{
			return new IndexRideDTO()
			{
				Owner = IndexUserDTO.GetFromUser(ride.Owner),
				Participants = ride.Participants.Select(participant => IndexUserDTO.GetFromUser(participant.User)).ToList(),
				Stops = ride.Stops.Select(stop => IndexStopDTO.GetFromStop(stop)).ToList(),
				Destination = ride.Destination,
				StartingLocation = ride.StartingLocation,
			};
		}
	}
}