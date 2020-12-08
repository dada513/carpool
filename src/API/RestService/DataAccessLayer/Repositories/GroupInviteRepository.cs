﻿using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DataAccessLayer.DatabaseContexts;
using Domain.Contracts.Repositories;
using Domain.Entities;
using IdentifiersShared.Identifiers;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Repositories
{
	public class GroupInviteRepository : IGroupInviteRepository
	{
		private readonly CarpoolDbContext _context;

		public GroupInviteRepository(CarpoolDbContext context)
			=> _context = context;

		public async Task<Domain.Entities.GroupInvite> GetByIdAsync(GroupInviteId id,
			CancellationToken cancellationToken = default)
			=> await _context.GroupInvites.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

		public async Task<GroupInvite> GetByIdAsNoTrackingAsync(GroupInviteId id,
			CancellationToken cancellationToken =
				default)
			=> await _context.Set<GroupInvite>().AsNoTracking()
				.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

		public async Task<List<Domain.Entities.GroupInvite>> GetPartAsync(CancellationToken cancellationToken)
			=> await _context.GroupInvites.ToListAsync(cancellationToken);

		public async Task<List<Domain.Entities.GroupInvite>> GetUserGroupInvitesByUserIdAsNoTrackingAsync(AppUserId appUserId,
			CancellationToken cancellationToken)
			=> await _context.GroupInvites.AsNoTracking()
				.Where(x => x.InvitedAppUserId == appUserId)
				.OrderByDescending(x => x.DateAdded)
				.ToListAsync(cancellationToken);


		public async Task AddAsync(GroupInvite groupInvite, CancellationToken cancellationToken)
			=> await _context.Set<GroupInvite>().AddAsync(groupInvite, cancellationToken);

        public void Delete(GroupInvite groupInvite)
        {
            throw new System.NotImplementedException();
        }
    }
}