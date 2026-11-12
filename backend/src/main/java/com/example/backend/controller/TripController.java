package com.example.backend.controller;

import com.example.backend.entity.Trip;
import com.example.backend.service.TripService;
import com.example.backend.dto.trip.TripStatusResponse;
import com.example.backend.dto.trip.UpdateTripStatusRequest;
import com.example.backend.exception.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/{id}")
    public Trip getTripById(@PathVariable Long id) {
        return tripService.getTripById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Trip createTrip(@RequestBody Trip trip) {
        return tripService.createTrip(trip);
    }

    @PutMapping("/{id}")
    public Trip updateTrip(
            @PathVariable Long id,
            @RequestBody Trip trip
    ) {
        return tripService.updateTrip(id, trip);
    }

   @PatchMapping("/{id}/status")
    public TripStatusResponse updateTripStatus(
            @PathVariable Long id,
            @RequestBody UpdateTripStatusRequest request
    ) {
        if (request == null) {
            throw new BadRequestException(
                    "Phải cung cấp thông tin trạng thái chuyến xe"
            );
        }

        return tripService.updateTripStatus(
                id,
                request.status()
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }
}

