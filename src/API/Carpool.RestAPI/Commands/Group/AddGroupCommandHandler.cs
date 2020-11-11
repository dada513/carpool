﻿using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoWrapper.Wrappers;
using Carpool.DAL.Repositories.Group;
using Carpool.DAL.Repositories.User;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Carpool.RestAPI.Commands.Group
{
	public class AddGroupCommandHandler : IRequestHandler<AddGroupCommand, Guid>
	{
		private readonly IGroupRepository _repository;
        private readonly IUserRepository _userRepository;

		public AddGroupCommandHandler(IGroupRepository repository, IUserRepository userRepository)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _userRepository = userRepository;
        }

        public async Task<Guid> Handle(AddGroupCommand request, CancellationToken cancellationToken)
        {
            if (!string.IsNullOrEmpty(request.Code)
                && await _repository.GroupCodeExists(request.Code).ConfigureAwait(false))
                throw new ApiException($"Group code {request.Code} already exists", StatusCodes.Status409Conflict);

            if (!await _userRepository.ExistsWithId(request.OwnerId, cancellationToken).ConfigureAwait(false))
                throw new ApiException($"User with id {request.OwnerId} does not exist.", StatusCodes.Status400BadRequest);
            
            var group = new Core.Models.Group()
            {
                Name = request.Name,
                Code = request.Code,
                OwnerId = request.OwnerId
            };

            group.Location = request.Longitude is null || request.Latitude is null ?
                                 null :
                                 new Core.Models.Location()
                                     {Latitude = (double) request.Latitude, Longitude = (double) request.Longitude};
            

            await _repository.AddAsync(group, cancellationToken).ConfigureAwait(false);
            try
            {
                await _repository.SaveAsync(cancellationToken).ConfigureAwait(false);
            }
            catch (DbUpdateException ex)
            {
                throw new ApiException(ex);
            }

            return group.Id;
        }
    }
}