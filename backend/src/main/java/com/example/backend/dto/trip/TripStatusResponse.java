package com.example.backend.dto.trip;

import com.example.backend.enums.TripStatus;

public record TripStatusResponse(
        Long id,
        TripStatus status
) {}