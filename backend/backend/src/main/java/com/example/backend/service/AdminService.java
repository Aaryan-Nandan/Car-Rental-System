package com.example.backend.service;

import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.Admin;
import com.example.backend.repository.AdminRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.DashboardResponse;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.CarRepository;
import com.example.backend.repository.CustomerRepository;
import com.example.backend.repository.PaymentRepository;

@Service
public class AdminService {

    // DASHBOARD DATA
    public DashboardResponse getDashboardData() {

        DashboardResponse response =
                new DashboardResponse();

        response.setTotalCustomers(
                customerRepository.count());

        response.setTotalCars(
                carRepository.count());

        response.setTotalBookings(
                bookingRepository.count());

        response.setTotalPayments(
                paymentRepository.count());

        return response;
    }

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    // REGISTER ADMIN
    public Object registerAdmin(Admin admin) {

        Admin existingAdmin =
                adminRepository.findByEmail(
                        admin.getEmail());

        if (existingAdmin != null) {

            return "Admin Already Exists";
        }

        return adminRepository.save(admin);
    }

    // LOGIN ADMIN
    public AuthResponse loginAdmin(
            LoginRequest loginRequest) {

        Admin admin =
                adminRepository.findByEmail(
                        loginRequest.getEmail());

        if (admin != null &&
                admin.getPassword().equals(
                        loginRequest.getPassword())) {

            String token =
                    jwtUtil.generateToken(
                            admin.getEmail());

            return new AuthResponse(
                    token,
                    null
            );
        }

        return null;
    }
}