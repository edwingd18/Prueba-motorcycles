package com.neexcorp.motorcycles.service;

import com.neexcorp.motorcycles.model.Sale;
import com.neexcorp.motorcycles.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    // CREATE
    public Sale create(Sale sale) {
        // Establecer la referencia bidireccional para los detalles
        if (sale.getDetails() != null && !sale.getDetails().isEmpty()) {
            sale.getDetails().forEach(detail -> {
                detail.setSale(sale);
                // Asegurar que el subtotal está calculado
                if (detail.getSubtotal() == null || detail.getSubtotal().doubleValue() == 0) {
                    detail.calculateSubtotal();
                }
            });
        }
        return saleRepository.save(sale);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<Sale> findAll() {
        return saleRepository.findAll();
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public Sale findById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + id));
        // Force loading of details to avoid lazy loading issues
        sale.getDetails().size();
        return sale;
    }

    // READ BY ID WITH DETAILS - specifically for detail view
    @Transactional(readOnly = true)
    public Sale findByIdWithDetails(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found with ID: " + id));
        // Force loading of details and their motorcycles
        if (sale.getDetails() != null) {
            sale.getDetails().forEach(detail -> {
                detail.getMotorcycle().getBrand(); // Force loading of motorcycle
            });
        }
        return sale;
    }

    // UPDATE
    public Sale update(Long id, Sale saleDetails) {
        Sale existingSale = findById(id);

        existingSale.setSaleNumber(saleDetails.getSaleNumber());
        existingSale.setCustomer(saleDetails.getCustomer());
        existingSale.setEmployee(saleDetails.getEmployee());
        existingSale.setSaleDate(saleDetails.getSaleDate());
        existingSale.setStatus(saleDetails.getStatus());
        existingSale.setTotal(saleDetails.getTotal());
        existingSale.setPaymentMethod(saleDetails.getPaymentMethod());

        // Actualizar los detalles si se proporcionan
        if (saleDetails.getDetails() != null) {
            // Limpiar detalles existentes de forma segura
            if (existingSale.getDetails() != null) {
                existingSale.getDetails().clear();
            }

            // Forzar la sincronización con la base de datos
            saleRepository.saveAndFlush(existingSale);

            // Agregar nuevos detalles
            saleDetails.getDetails().forEach(detail -> {
                // Crear un nuevo detalle para evitar problemas de persistencia
                detail.setId(null); // Asegurar que es un nuevo detalle
                detail.setSale(existingSale);
                if (detail.getSubtotal() == null || detail.getSubtotal().doubleValue() == 0) {
                    detail.calculateSubtotal();
                }
                existingSale.getDetails().add(detail);
            });
        }

        return saleRepository.save(existingSale);
    }

    // DELETE
    public void delete(Long id) {
        Sale sale = findById(id);
        saleRepository.delete(sale);
    }
}