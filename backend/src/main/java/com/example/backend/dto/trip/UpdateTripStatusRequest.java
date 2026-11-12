package com.example.backend.dto.trip;

import com.example.backend.enums.TripStatus;

public record UpdateTripStatusRequest(
        TripStatus status
) {}