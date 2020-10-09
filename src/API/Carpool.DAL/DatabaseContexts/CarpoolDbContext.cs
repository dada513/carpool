﻿using System;
using System.Reflection;
using Carpool.Core.Models;
using Carpool.Core.Models.Intersections;
using Microsoft.EntityFrameworkCore;

namespace Carpool.DAL.DatabaseContexts
{
	public class CarpoolDbContext : DbContext
	{
		public CarpoolDbContext(DbContextOptions<CarpoolDbContext> options)
			: base(options)
		{
		}

		#region Intersections

		public DbSet<UserParticipatedRide> UserParticipatedRides { get; set; }
		
		public DbSet<UserGroup> UserGroups { get; set; }

		#endregion Intersections

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			_ = modelBuilder ?? throw new NullReferenceException(nameof(modelBuilder));

			base.OnModelCreating(modelBuilder);

			modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

			modelBuilder.Entity<UserParticipatedRide>()
			            .HasKey(upr => new {upr.UserId, upr.RideId});

			modelBuilder.Entity<UserParticipatedRide>()
			            .HasOne(ur => ur.User)
			            .WithMany(ur => ur.ParticipatedRides)
			            .HasForeignKey(ug => ug.UserId);

			modelBuilder.Entity<UserParticipatedRide>()
			            .HasOne(ur => ur.Ride)
			            .WithMany(ur => ur.Participants)
			            .HasForeignKey(ur => ur.RideId);

			modelBuilder.Entity<GroupInvite>()
			            .HasOne(ur => ur.InvitedUser)
			            .WithMany(iu => iu.GroupInvites)
			            .HasForeignKey(ur => ur.InvitedUserId);

			#region DataSeeding

			//modelBuilder.Entity<User>().HasData(new User()
			//{
			//	FirstName = "Krzysztof",
			//	LastName = "Kononowicz",
			//	Email = "biurointerwencjiobywatelskich@kononowicz.pl",
			//	Id = new Guid("40ab249f-a1ee-48ec-f24b-08d7e933352c"),
			//	PhoneNumber = "997997997",
			//	Locations = new List<Location>()
			//	{
			//		new Location()
			//		{
			//			Coordinates = new Coordinates()
			//			{
			//				Latitude = 23.086287,
			//				Longitude = 53.123454,
			//				Id = new Guid("81c9e763-7c57-4e9c-a263-08d7e930c1ef")
			//			},
			//			LocationName = new LocationName()
			//			{
			//				Id = new Guid("f2d1545b-0ba6-47af-6679-08d7e930c1fb"),
			//				Name = "ul. Szkolna 17, Białystok"
			//			}
			//		}
			//	}
			//});

			#endregion DataSeeding
		}

		#region Models

		public DbSet<Location> Locations { get; set; }
		public DbSet<User> Users { get; set; }
		public DbSet<Group> Groups { get; set; }
		public DbSet<Company> Companies { get; set; }
		public DbSet<Ride> Rides { get; set; }
		public DbSet<RideRequest> RideRequests { get; set; }
		public DbSet<Stop> Stops { get; set; }
		public DbSet<Rating> Ratings { get; set; }
		public DbSet<Vehicle> Vehicles { get; set; }
		public DbSet<GroupInvite> GroupInvites { get; set; }

		#endregion Models
	}
}