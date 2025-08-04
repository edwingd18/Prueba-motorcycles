package com.neexcorp.motorcycles.controller;

import com.neexcorp.motorcycles.model.DetailSale;
import com.neexcorp.motorcycles.service.DetailSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detail-sales")
@CrossOrigin(origins = "*")
public class DetailSaleController {

    @Autowired
    private DetailSaleService detailSaleService;

    // CREATE
    @PostMapping
    public ResponseEntity<DetailSale> create(@RequestBody DetailSale detailSale) {
        try {
            DetailSale created = detailSaleService.create(detailSale);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<DetailSale>> getAll() {
        try {
            List<DetailSale> detailSales = detailSaleService.findAll();
            return new ResponseEntity<>(detailSales, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<DetailSale> getById(@PathVariable Long id) {
        try {
            DetailSale detailSale = detailSaleService.findById(id);
            return new ResponseEntity<>(detailSale, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<DetailSale> update(@PathVariable Long id, @RequestBody DetailSale detailSale) {
        try {
            DetailSale updated = detailSaleService.update(id, detailSale);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id) {
        try {
            detailSaleService.delete(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}