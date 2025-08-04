package com.neexcorp.motorcycles.controller;

import com.neexcorp.motorcycles.model.Motorcycle;
import com.neexcorp.motorcycles.service.MotorcycleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motorcycles")
@CrossOrigin(origins = "*")
public class MotorcycleController {

    @Autowired
    private MotorcycleService motorcycleService;

    // CREATE
    @PostMapping
    public ResponseEntity<Motorcycle> create(@RequestBody Motorcycle motorcycle) {
        try {
            Motorcycle created = motorcycleService.create(motorcycle);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Motorcycle>> getAll() {
        try {
            List<Motorcycle> motorcycles = motorcycleService.findAll();
            return new ResponseEntity<>(motorcycles, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Motorcycle> getById(@PathVariable Long id) {
        try {
            Motorcycle motorcycle = motorcycleService.findById(id);
            return new ResponseEntity<>(motorcycle, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Motorcycle> update(@PathVariable Long id, @RequestBody Motorcycle motorcycle) {
        try {
            Motorcycle updated = motorcycleService.update(id, motorcycle);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        try {
            motorcycleService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}