package com.example.Laptops.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Laptops.Entity.LaptopEntity;

@Repository
public interface LaptopRepository extends JpaRepository<LaptopEntity, Integer> {

    LaptopEntity findByLapCode(String lapCode);

}
