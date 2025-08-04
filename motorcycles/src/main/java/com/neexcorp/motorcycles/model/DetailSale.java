package com.neexcorp.motorcycles.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "detail_sales")
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class DetailSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false)
    @JsonBackReference
    private Sale sale;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "motorcycle_id", nullable = false)
    private Motorcycle motorcycle;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(nullable = false)
    private BigDecimal subtotal;

    private String notes;

    @PrePersist
    @PreUpdate
    public void calculateSubtotal() {
        if (unitPrice != null && quantity != null) {
            BigDecimal total = unitPrice.multiply(BigDecimal.valueOf(quantity));
            this.subtotal = total.subtract(discount != null ? discount : BigDecimal.ZERO);
        }
    }
}
