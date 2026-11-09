package com.example.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateUserRequest(
        @NotBlank(message = "Tên đăng nhập không được để trống")
        String username,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email,

        String fullName,

        @Pattern(regexp = "^$|^[0-9+]{9,15}$", message = "Số điện thoại không hợp lệ")
        String phone
) {
}
