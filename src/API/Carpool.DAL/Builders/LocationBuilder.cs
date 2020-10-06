﻿using System;
using System.Runtime.InteropServices.ComTypes;
using Carpool.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Carpool.DAL.Builders
{
	public class LocationBuilder : IEntityTypeConfiguration<Location>
	{
		public void Configure(EntityTypeBuilder<Location> builder)
		{
			_ = builder ?? throw new NullReferenceException(nameof(builder));

			builder.HasKey(x => x.Id);

			builder.Property(x => x.Name);

			builder.HasOne(x => x.Coordinates)
			       .WithMany()
			       .HasForeignKey(x => x.CoordinatesId);
		}
	}
}