﻿#nullable enable
using DataTransferObjects.VehicleDtos;
using IdentifiersShared.Identifiers;
using Newtonsoft.Json;

namespace RestApi.DTOs.User
{
    public record UpdateUserDto([property: JsonProperty("firstName")] string FirstName,
        [property: JsonProperty("lastName")] string LastName);

    public record AddUserDto([property: JsonProperty("id")]AppUserId AppUserId, 
        [property: JsonProperty("firstName")]string FirstName,
        [property: JsonProperty("lastName")]string LastName,
        [property: JsonProperty("email")]string Email);

    public record OwnerDto([JsonProperty("rating")] double Rating,
        [JsonProperty("firstName")] string FirstName,
        [JsonProperty("lastName")]string LastName,
        [JsonProperty("id")] AppUserId Id,
        [JsonProperty("vehicle")]IndexVehicleDto? Vehicle);

    public record InvitingUserDto([JsonProperty("id")] AppUserId AppUserId,
        [JsonProperty("firstName")] string FirstName,
        [JsonProperty("lastName")] string LastName);
    
    public record InvitedUserDto([JsonProperty("id")] AppUserId AppUserId,
        [JsonProperty("firstName")] string FirstName,
        [JsonProperty("lastName")] string LastName);

    public record InviteUserDto([JsonProperty("id")] AppUserId AppUserId,
        [JsonProperty("firstName")] string FistName,
        [JsonProperty("lastName")] string LastName);

    public record UserSettingsDto([JsonProperty("id")] AppUserId AppUserId,
        [JsonProperty("firstName")] string FirstName,
        [JsonProperty("lastName")] string LastName,
        [JsonProperty("vehicle")] IndexVehicleDto Vehicle);
}