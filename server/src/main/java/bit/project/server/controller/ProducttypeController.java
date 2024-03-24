package bit.project.server.controller;

import bit.project.server.dao.ProducttypeDao;
import bit.project.server.dao.SupplierstatusDao;
import bit.project.server.entity.Producttype;
import bit.project.server.entity.Supplierstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/producttypes")
public class ProducttypeController {

    @Autowired
    private ProducttypeDao producttypeDao;

    @GetMapping
    public List<Producttype> getAll(){
        return producttypeDao.findAll();
    }
}
