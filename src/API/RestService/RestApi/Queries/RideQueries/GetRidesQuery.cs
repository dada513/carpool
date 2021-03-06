﻿using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Domain.Contracts.Repositories;
using Domain.Entities;
using MediatR;

namespace RestApi.Queries.RideQueries
{
	public class GetRidesQuery : IRequest<IEnumerable<Ride>> { }
	
	public class GetRidesQueryHandler : IRequestHandler<GetRidesQuery, IEnumerable<Ride>>
	{
		private readonly IRideRepository _repository;

		public GetRidesQueryHandler(IRideRepository repository)
			=> _repository = repository;

		public async Task<IEnumerable<Ride>> Handle(GetRidesQuery request,
			CancellationToken cancellationToken)
		{
			var rides = await _repository.GetPartAsNoTrackingAsync(cancellationToken).ConfigureAwait(false);
			return rides;
		}
	}
}