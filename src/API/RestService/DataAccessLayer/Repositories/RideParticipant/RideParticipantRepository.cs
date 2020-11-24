﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DataAccessLayer.DatabaseContexts;
using Domain.Entities.Intersections;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repositories.RideParticipant
{
	public class RideParticipantRepository : IRideParticipantRepository
	{
		private readonly CarpoolDbContext _context;

		public RideParticipantRepository(CarpoolDbContext context)
			=> _context = context;

		public async Task<List<UserParticipatedRide>> GetParticipantsByRideId(Guid rideId,
		                                                                      CancellationToken cancellationToken =
			                                                                      default)
			=> await _context.UserParticipatedRides.Where(x => x.RideId == rideId).ToListAsync(cancellationToken)
			                 .ConfigureAwait(false);

		public async Task SaveAsync(CancellationToken cancellationToken)
			=> await _context.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
	}
}