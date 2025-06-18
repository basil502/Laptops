package com.example.Laptops.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.Laptops.Entity.CompanyEntity;
import com.example.Laptops.Entity.LaptopEntity;
import com.example.Laptops.Repository.CompanyRepository;
import com.example.Laptops.Repository.LaptopRepository;

@Service
public class LaptopService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private LaptopRepository laptopRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public ResponseEntity<String> saveLaptop(LaptopEntity laptop) {
        laptopRepository.save(laptop);
        return ResponseEntity.ok("Laptop saved successfully");
    }

    public Optional<LaptopEntity> updateLaptop(int id, LaptopEntity updateLaptop) {
        return laptopRepository.findById(id).map(laptop -> {
            laptop.setLap_code(updateLaptop.getLap_code());
            laptop.setCompany(updateLaptop.getCompany());
            laptop.setModel_name(updateLaptop.getModel_name());
            laptop.setProcessor(updateLaptop.getProcessor());
            laptop.setPrice(updateLaptop.getPrice());
            laptop.setStatus(updateLaptop.getStatus());
            laptop.setColour(updateLaptop.getColour());
            laptop.setMemory(updateLaptop.getMemory());
            laptop.setDisplay(updateLaptop.getDisplay());
            laptop.setGraphicsCard(updateLaptop.getGraphicsCard());

            return laptopRepository.save(laptop);
        });
    }

    public List<CompanyEntity> getAllCompanies() {
        return companyRepository.findAll();
    }

    public List<LaptopEntity> getAllLaptops() {
        return laptopRepository.findAll();
    }

    public void deleteLaptopById(int id) {
        laptopRepository.deleteById(id);
    }

    public LaptopEntity getLaptopByLapCode(String lapCode) {
        return laptopRepository.findByLapCode(lapCode);
    }

    public LaptopEntity getLaptopById(int id) {
        return laptopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Laptop not found with ID: " + id));
    }

    public List<LaptopEntity> searchLaptop(String model_name, Integer c_id, String lapCode, String processor,
            String memory, String graphicsCard, Double minPrice, Double maxPrice,
            Boolean status, String sortBy, String sortOrder) {

        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<LaptopEntity> cq = cb.createQuery(LaptopEntity.class);
        Root<LaptopEntity> root = cq.from(LaptopEntity.class);

        List<Predicate> predicates = new ArrayList<>();

        if (model_name != null && !(model_name = model_name.trim()).isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("model_name")), "%" + model_name.toLowerCase() + "%"));
        }

        if (c_id != null && c_id > 0) {
            predicates.add(cb.equal(root.get("company").get("cmpny_id"), c_id));
        }

        if (lapCode != null && !(lapCode = lapCode.trim()).isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("lapCode")), "%" + lapCode.toLowerCase() + "%"));
        }

        if (processor != null && !(processor = processor.trim()).isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("processor")), "%" + processor.toLowerCase() + "%"));
        }

        if (memory != null && !(memory = memory.trim()).isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("memory")), "%" + memory.toLowerCase() +"%"));
        }

        if (graphicsCard != null && !(graphicsCard = graphicsCard.trim()).isEmpty()) {
            predicates.add(cb.like(cb.lower(root.get("graphicsCard")), "%" + graphicsCard.toLowerCase() + "%"));
        }

        if (minPrice != null && minPrice > 0) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null && maxPrice > 0) {
            predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        if (status != null) {
            predicates.add(cb.equal(root.get("status"), status));
        }

        cq.where(cb.and(predicates.toArray(new Predicate[0])));

        boolean asc = !"desc".equalsIgnoreCase(sortOrder);

        Path<?> sortPath;
        if (sortBy != null) {
            switch (sortBy.toLowerCase()) {
                case "price":
                    sortPath = root.get("price");
                    break;
                case "lapcode":
                    sortPath = root.get("lapCode");
                    break;
                case "processor":
                    sortPath = root.get("processor");
                    break;
                case "model_name":
                default:
                    sortPath = root.get("model_name");
            }
        } else {
            sortPath = root.get("model_name");
        }

        cq.orderBy(asc ? cb.asc(sortPath) : cb.desc(sortPath));

        return entityManager.createQuery(cq).getResultList();
    }

}
