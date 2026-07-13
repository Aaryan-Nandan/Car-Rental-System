package com.example.backend.controller;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.Admin;
import com.example.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.DashboardResponse;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // REGISTER ADMIN
    @PostMapping("/register")
    public Object registerAdmin(
            @RequestBody Admin admin) {

        return adminService.registerAdmin(admin);
    }

    // LOGIN ADMIN
// LOGIN ADMIN

    @PostMapping("/login")

    public AuthResponse loginAdmin(
            @RequestBody LoginRequest loginRequest) {

        return adminService
                .loginAdmin(loginRequest);
    }

    @GetMapping("/dashboard")

    public DashboardResponse getDashboardData() {

        return adminService.getDashboardData();
    }
}