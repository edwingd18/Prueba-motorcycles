package com.neexcorp.motorcycles.repository;

import com.neexcorp.motorcycles.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Solo CRUD básico heredado de JpaRepository:
    // save(), findAll(), findById(), deleteById(), etc.
}