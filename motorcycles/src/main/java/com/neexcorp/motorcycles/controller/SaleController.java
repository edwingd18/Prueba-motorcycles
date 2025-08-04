package com.neexcorp.motorcycles.controller;

import com.neexcorp.motorcycles.model.Sale;
import com.neexcorp.motorcycles.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin(origins = "*")
public class SaleController {

    @Autowired
    private SaleService saleService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Sale sale) {
        try {
            Sale created = saleService.create(sale);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al crear la venta: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Sale> sales = saleService.findAll();
            return ResponseEntity.ok(sales);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al obtener las ventas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Sale sale = saleService.findById(id);
            return ResponseEntity.ok(sale);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Venta no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // READ BY ID WITH DETAILS
    @GetMapping("/{id}/details")
    public ResponseEntity<?> getByIdWithDetails(@PathVariable Long id) {
        try {
            Sale sale = saleService.findByIdWithDetails(id);
            return ResponseEntity.ok(sale);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Venta no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Sale sale) {
        try {
            Sale updated = saleService.update(id, sale);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al actualizar la venta: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            saleService.delete(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Venta eliminada exitosamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Error al eliminar la venta: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}