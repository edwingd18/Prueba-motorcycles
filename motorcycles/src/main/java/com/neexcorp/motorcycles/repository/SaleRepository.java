package com.neexcorp.motorcycles.repository;

import com.neexcorp.motorcycles.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
        // Solo CRUD básico heredado de JpaRepository:
        // save(), findAll(), findById(), deleteById(), etc.
}