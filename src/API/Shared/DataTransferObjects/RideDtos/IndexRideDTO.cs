﻿using DataTransferObjects;
using Domain.ValueObjects;
using RestApi.DTOs.Stop;
using RestApi.DTOs.User;
using System;
using System.Collections.Generic;

namespace RestApi.DTOs.Ride
{
    public class IndexRideDTO
    {
        public IndexRideDTO(Guid rideId,
            IndexUserDto owner,
            List<IndexUserDto> participants,
            List<IndexStopDTO> stops,
            LocationDto destination,
            LocationDto startingLocation,
            DateTime date,
            bool isUserParticipant)
        {
            RideId = rideId;
            Owner = owner;
            Participants = participants;
            Stops = stops;
            Destination = new Location(destination.longitude, destination.latitude);
            StartingLocation = new Location(startingLocation.longitude, startingLocation.latitude);
            Date = date;
            IsUserParticipant = isUserParticipant;
        }

        private IndexRideDTO() { }

        public Guid RideId { get; set; }
        public IndexUserDto Owner { get; set; }
        public List<IndexUserDto> Participants { get; set; }

        public List<IndexStopDTO> Stops { get; set; }

        public Location Destination { get; set; }
        public Location StartingLocation { get; set; }

        public DateTime Date { get; set; }

        public bool IsUserParticipant { get; set; }
    }
}