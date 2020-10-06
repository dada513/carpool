﻿using System;
using Carpool.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Carpool.DAL.Builders
{
	public class StopBuilder : IEntityTypeConfiguration<Stop>
	{
		public void Configure(EntityTypeBuilder<Stop> builder)
		{
			_ = builder ?? throw new NullReferenceException(nameof(builder));

			builder.HasKey(x => x.Id);


			builder.HasOne(x => x.User)
			       .WithMany()
			       .HasForeignKey(x => x.UserId);

			builder.HasOne(x => x.Coordinates)
			       .WithMany()
			       .HasForeignKey(x => x.CoordinatesId);

			builder.HasOne(x => x.Ride)
			       .WithMany()
			       .HasForeignKey(x => x.RideId);
		}
	}
}