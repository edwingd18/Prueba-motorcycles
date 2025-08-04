package com.neexcorp.motorcycles.repository;

import com.neexcorp.motorcycles.model.Motorcycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MotorcycleRepository extends JpaRepository<Motorcycle, Long> {
    // Solo CRUD básico heredado de JpaRepository:
    // save(), findAll(), findById(), deleteById(), etc.
}