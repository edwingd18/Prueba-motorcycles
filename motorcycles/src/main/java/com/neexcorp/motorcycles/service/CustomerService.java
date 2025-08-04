package com.neexcorp.motorcycles.service;

import com.neexcorp.motorcycles.model.Customer;
import com.neexcorp.motorcycles.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // CREATE
    public Customer create(Customer customer) {
        customer.setCreatedAt(LocalDateTime.now());
        customer.setUpdatedAt(LocalDateTime.now());
        return customerRepository.save(customer);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public Customer findById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found with ID: " + id));
    }

    // UPDATE
    public Customer update(Long id, Customer customerDetails) {
        Customer existingCustomer = findById(id);

        existingCustomer.setFirstName(customerDetails.getFirstName());
        existingCustomer.setLastName(customerDetails.getLastName());
        existingCustomer.setEmail(customerDetails.getEmail());
        existingCustomer.setPhone(customerDetails.getPhone());
        existingCustomer.setDocumentNumber(customerDetails.getDocumentNumber());
        existingCustomer.setDocumentType(customerDetails.getDocumentType());
        existingCustomer.setAddress(customerDetails.getAddress());
        existingCustomer.setCity(customerDetails.getCity());
        existingCustomer.setState(customerDetails.getState());
        existingCustomer.setZipCode(customerDetails.getZipCode());
        existingCustomer.setCountry(customerDetails.getCountry());
        existingCustomer.setBirthDate(customerDetails.getBirthDate());
        existingCustomer.setStatus(customerDetails.getStatus());
        existingCustomer.setNotes(customerDetails.getNotes());
        existingCustomer.setUpdatedAt(LocalDateTime.now());

        return customerRepository.save(existingCustomer);
    }

    // DELETE
    public void delete(Long id) {
        Customer customer = findById(id);
        customerRepository.delete(customer);
    }
}