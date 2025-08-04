package com.neexcorp.motorcycles.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "employees")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Column(unique = true)
    private String documentNumber; // DNI, Cedula, etc.

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    @Column(nullable = false)
    private String jobTitle;

    private BigDecimal salary;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "termination_date")
    private LocalDate terminationDate;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status = EmployeeStatus.ACTIVE;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum EmployeeStatus {
        ACTIVE, INACTIVE, TERMINATED
    }

    public enum DocumentType {
        DNI, CEDULA, PASSPORT, DRIVER_LICENSE
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
