package com.example.Laptops.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Laptops.Entity.CompanyEntity;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity , Integer> {
    

}
