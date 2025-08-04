package com.neexcorp.motorcycles.repository;

import com.neexcorp.motorcycles.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // Solo CRUD básico heredado de JpaRepository:
    // save(), findAll(), findById(), deleteById(), etc.
}