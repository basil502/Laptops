package com.example.Laptops.Repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Laptops.Entity.CompanyEntity;
import com.example.Laptops.Entity.LaptopEntity;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity , Integer> {
    

}
