package com.example.Laptops.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity

public class LaptopEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int lap_id;

    @Column(nullable = false)
    private String model_name;

    @ManyToOne
    @JoinColumn(name = "c_id", nullable = false)
    private CompanyEntity company;

    @Column(unique = true, nullable = false)
    private String lapCode;

    @Column(nullable = false)
    private String processor;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Boolean status;

    @Column(nullable = false)
    private String graphicsCard;

    public String getGraphicsCard() {
        return graphicsCard;
    }

    public void setGraphicsCard(String graphicsCard) {
        this.graphicsCard = graphicsCard;
    }

    @Column(nullable = false)
    private String memory;

    @Column(nullable = false)
    private String colour;

    public String getColour() {
        return colour;
    }

    public void setColour(String colour) {
        this.colour = colour;
    }

    @Column(nullable = false)
    private String display;

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public String getMemory() {
        return memory;
    }

    public void setMemory(String memory) {
        this.memory = memory;
    }

    public int getLap_id() {
        return lap_id;
    }

    public void setLap_id(int lap_id) {
        this.lap_id = lap_id;
    }

    public String getModel_name() {
        return model_name;
    }

    public void setModel_name(String model_name) {
        this.model_name = model_name;
    }

    public CompanyEntity getCompany() {
        return company;
    }

    public void setCompany(CompanyEntity company) {
        this.company = company;
    }

    public String getLap_code() {
        return lapCode;
    }

    public void setLap_code(String lapCode) {
        this.lapCode = lapCode;
    }

    public String getProcessor() {
        return processor;
    }

    public void setProcessor(String processor) {
        this.processor = processor;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

}
