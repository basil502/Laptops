package com.example.Laptops.Entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)

@Entity
public class CompanyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cmpny_id;

    @Column(unique = true, nullable = false)
    private String cmpny_code;

    @Column(nullable = false)
    private String cmpny_name;

    public int getCmpny_id() {
        return cmpny_id;
    }

    public void setCmpny_id(int cmpny_id) {
        this.cmpny_id = cmpny_id;
    }

    public String getCmpny_code() {
        return cmpny_code;
    }

    public void setCmpny_code(String cmpny_code) {
        this.cmpny_code = cmpny_code;
    }

    public String getCmpny_name() {
        return cmpny_name;
    }

    public void setCmpny_name(String cmpny_name) {
        this.cmpny_name = cmpny_name;
    }
    
}
