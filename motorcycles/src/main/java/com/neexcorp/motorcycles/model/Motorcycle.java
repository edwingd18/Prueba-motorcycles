package com.neexcorp.motorcycles.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "motorcycles")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Motorcycle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    private MotorcycleType type;

    private String model;
    private Integer year;
    private String color;
    private Integer stock;
    private Boolean available = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum MotorcycleType {
        SPORT, CRUISER, TOURING, STANDARD, DIRT_BIKE, SCOOTER, ELECTRIC
    }
}
