package com.neexcorp.motorcycles.service;

import com.neexcorp.motorcycles.model.Motorcycle;
import com.neexcorp.motorcycles.repository.MotorcycleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class MotorcycleService {

    @Autowired
    private MotorcycleRepository motorcycleRepository;

    // CREATE
    public Motorcycle create(Motorcycle motorcycle) {
        motorcycle.setCreatedAt(LocalDateTime.now());
        motorcycle.setUpdatedAt(LocalDateTime.now());
        return motorcycleRepository.save(motorcycle);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<Motorcycle> findAll() {
        return motorcycleRepository.findAll();
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public Motorcycle findById(Long id) {
        return motorcycleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Motorcycle not found with ID: " + id));
    }

    // UPDATE
    public Motorcycle update(Long id, Motorcycle motorcycleDetails) {
        Motorcycle existingMotorcycle = findById(id);

        existingMotorcycle.setCode(motorcycleDetails.getCode());
        existingMotorcycle.setName(motorcycleDetails.getName());
        existingMotorcycle.setDescription(motorcycleDetails.getDescription());
        existingMotorcycle.setBrand(motorcycleDetails.getBrand());
        existingMotorcycle.setPrice(motorcycleDetails.getPrice());
        existingMotorcycle.setType(motorcycleDetails.getType());
        existingMotorcycle.setModel(motorcycleDetails.getModel());
        existingMotorcycle.setYear(motorcycleDetails.getYear());
        existingMotorcycle.setColor(motorcycleDetails.getColor());
        existingMotorcycle.setStock(motorcycleDetails.getStock());
        existingMotorcycle.setAvailable(motorcycleDetails.getAvailable());
        existingMotorcycle.setUpdatedAt(LocalDateTime.now());

        return motorcycleRepository.save(existingMotorcycle);
    }

    // DELETE
    public void delete(Long id) {
        Motorcycle motorcycle = findById(id);
        motorcycleRepository.delete(motorcycle);
    }
}