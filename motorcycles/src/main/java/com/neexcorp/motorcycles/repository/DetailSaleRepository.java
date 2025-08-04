package com.neexcorp.motorcycles.repository;

import com.neexcorp.motorcycles.model.DetailSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetailSaleRepository extends JpaRepository<DetailSale, Long> {
        // CRUD básico heredado de JpaRepository con EAGER loading
}