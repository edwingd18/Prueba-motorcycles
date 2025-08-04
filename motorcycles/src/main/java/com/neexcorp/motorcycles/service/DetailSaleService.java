package com.neexcorp.motorcycles.service;

import com.neexcorp.motorcycles.model.DetailSale;
import com.neexcorp.motorcycles.repository.DetailSaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DetailSaleService {

    @Autowired
    private DetailSaleRepository detailSaleRepository;

    // CREATE
    public DetailSale create(DetailSale detailSale) {
        return detailSaleRepository.save(detailSale);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<DetailSale> findAll() {
        return detailSaleRepository.findAll();
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public DetailSale findById(Long id) {
        return detailSaleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("DetailSale not found with ID: " + id));
    }

    // UPDATE
    public DetailSale update(Long id, DetailSale detailSaleDetails) {
        DetailSale existingDetailSale = findById(id);

        existingDetailSale.setSale(detailSaleDetails.getSale());
        existingDetailSale.setMotorcycle(detailSaleDetails.getMotorcycle());
        existingDetailSale.setQuantity(detailSaleDetails.getQuantity());
        existingDetailSale.setUnitPrice(detailSaleDetails.getUnitPrice());
        existingDetailSale.setDiscount(detailSaleDetails.getDiscount());
        existingDetailSale.setSubtotal(detailSaleDetails.getSubtotal());
        existingDetailSale.setNotes(detailSaleDetails.getNotes());

        return detailSaleRepository.save(existingDetailSale);
    }

    // DELETE
    public void delete(Long id) {
        DetailSale detailSale = findById(id);
        detailSaleRepository.delete(detailSale);
    }
}