package com.example.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    private String name;


    @Column(unique = true)
    private String email;


    private String password;


    // Main phone number
    // This will remain read-only
    // from the Profile page.

    private String phone;


    // ==========================================
    // ADDITIONAL CUSTOMER INFORMATION
    // ==========================================

    // Alternate Mobile Number

    private String alternatePhone;


    // Blood Group

    private String bloodGroup;


    // Permanent Address

    @Column(length = 1000)
    private String address;


    // ==========================================
    // PROFILE PHOTO
    // ==========================================

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profilePhoto;


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================


    // ==========================================
    // ID
    // ==========================================

    public Long getId() {

        return id;
    }


    public void setId(Long id) {

        this.id = id;
    }


    // ==========================================
    // NAME
    // ==========================================

    public String getName() {

        return name;
    }


    public void setName(String name) {

        this.name = name;
    }


    // ==========================================
    // EMAIL
    // ==========================================

    public String getEmail() {

        return email;
    }


    public void setEmail(String email) {

        this.email = email;
    }


    // ==========================================
    // PASSWORD
    // ==========================================

    public String getPassword() {

        return password;
    }


    public void setPassword(String password) {

        this.password = password;
    }


    // ==========================================
    // PHONE
    // ==========================================

    public String getPhone() {

        return phone;
    }


    public void setPhone(String phone) {

        this.phone = phone;
    }


    // ==========================================
    // ALTERNATE PHONE
    // ==========================================

    public String getAlternatePhone() {

        return alternatePhone;
    }


    public void setAlternatePhone(
            String alternatePhone) {

        this.alternatePhone =
                alternatePhone;
    }


    // ==========================================
    // BLOOD GROUP
    // ==========================================

    public String getBloodGroup() {

        return bloodGroup;
    }


    public void setBloodGroup(
            String bloodGroup) {

        this.bloodGroup =
                bloodGroup;
    }


    // ==========================================
    // ADDRESS
    // ==========================================

    public String getAddress() {

        return address;
    }


    public void setAddress(
            String address) {

        this.address =
                address;
    }


    // ==========================================
    // PROFILE PHOTO
    // ==========================================

    public String getProfilePhoto() {

        return profilePhoto;
    }


    public void setProfilePhoto(
            String profilePhoto) {

        this.profilePhoto =
                profilePhoto;
    }

}