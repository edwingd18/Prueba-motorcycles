package com.neexcorp.motorcycles.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "customers")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(unique = true)
    private String documentNumber;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    private CustomerStatus status = CustomerStatus.ACTIVE;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum DocumentType {
        DNI, CEDULA, PASSPORT, DRIVER_LICENSE
    }

    public enum CustomerStatus {
        ACTIVE, INACTIVE, BLOCKED
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}