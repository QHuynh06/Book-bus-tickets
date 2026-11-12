package com.example.backend.dto.booking;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PassengerDetails(
        @NotNull Long seatId,

        @NotBlank
        @Size(max = 120)
        String passengerName,

        @NotBlank
        @Pattern(
            regexp = "^0[0-9]{9}$",
            message = "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"
        )
        String passengerPhone
) {
}