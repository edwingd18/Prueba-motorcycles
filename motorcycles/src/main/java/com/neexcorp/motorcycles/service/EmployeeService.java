package com.neexcorp.motorcycles.service;

import com.neexcorp.motorcycles.model.Employee;
import com.neexcorp.motorcycles.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // CREATE
    public Employee create(Employee employee) {
        employee.setCreatedAt(LocalDateTime.now());
        employee.setUpdatedAt(LocalDateTime.now());
        return employeeRepository.save(employee);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public Employee findById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
    }

    // UPDATE
    public Employee update(Long id, Employee employeeDetails) {
        Employee existingEmployee = findById(id);

        existingEmployee.setFirstName(employeeDetails.getFirstName());
        existingEmployee.setLastName(employeeDetails.getLastName());
        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setPhone(employeeDetails.getPhone());
        existingEmployee.setAddress(employeeDetails.getAddress());
        existingEmployee.setCity(employeeDetails.getCity());
        existingEmployee.setState(employeeDetails.getState());
        existingEmployee.setZipCode(employeeDetails.getZipCode());
        existingEmployee.setCountry(employeeDetails.getCountry());
        existingEmployee.setJobTitle(employeeDetails.getJobTitle());
        existingEmployee.setSalary(employeeDetails.getSalary());
        existingEmployee.setHireDate(employeeDetails.getHireDate());
        existingEmployee.setTerminationDate(employeeDetails.getTerminationDate());
        existingEmployee.setStatus(employeeDetails.getStatus());
        existingEmployee.setNotes(employeeDetails.getNotes());
        existingEmployee.setUpdatedAt(LocalDateTime.now());

        return employeeRepository.save(existingEmployee);
    }

    // DELETE
    public void delete(Long id) {
        Employee employee = findById(id);
        employeeRepository.delete(employee);
    }
}