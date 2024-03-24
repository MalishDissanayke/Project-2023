package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.dao.MaterialDao;
import bit.project.server.dao.ProductDao;
import bit.project.server.entity.*;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.helper.FileHelper;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.security.AccessControlManager;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.RollbackException;
import javax.persistence.Tuple;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/products")
public class ProductController {

    @Autowired
    private ProductDao productDao;

    @Autowired
    private MaterialDao materialDao;

    @Autowired
    private AccessControlManager accessControlManager;
    @Autowired
    private FileDao fileDao;

    @Autowired
    private CodeGenerator codeGenerator;
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");

    public ProductController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("product");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("PR");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Product> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all products", UsecaseList.SHOW_ALL_PRODUCTS);

        if(pageQuery.isEmptySearch()){
            return productDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer productstatusId = pageQuery.getSearchParamAsInteger("productstatus");
        Integer producttypeId = pageQuery.getSearchParamAsInteger("producttype");

        List<Product> products = productDao.findAll(DEFAULT_SORT);
        Stream<Product> stream = products.parallelStream();

        List<Product> filteredProducts = stream.filter(product -> {
            if(code!=null)
                if(!product.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!product.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(productstatusId!=null)
                if(!product.getProductstatus().getId().equals(productstatusId)) return false;
            if(producttypeId!=null)
                if(!product.getProducttype().getId().equals(producttypeId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredProducts, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Product> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all products' basic data", UsecaseList.SHOW_ALL_PRODUCTS, UsecaseList.ADD_PRODUCT, UsecaseList.UPDATE_PRODUCT, UsecaseList.ADD_PURCHASE, UsecaseList.UPDATE_PURCHASE);
        return productDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Product get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get product", UsecaseList.SHOW_PRODUCT_DETAILS);
        Optional<Product> optionalProduct = productDao.findById(id);
        if(optionalProduct.isEmpty()) throw new ObjectNotFoundException("Product not found");
        return optionalProduct.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete products", UsecaseList.DELETE_PRODUCT);

        try{
            if(productDao.existsById(id)) productDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this product already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Product product, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new product", UsecaseList.ADD_PRODUCT);

        product.setTocreation(LocalDateTime.now());
        product.setCreator(authUser);
        product.setId(null);
        product.setProductstatus(new Productstatus(1));;


        EntityValidator.validate(product);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        for(Productmaterial productmaterial : product.getProductmaterialList()) productmaterial.setProduct(product);

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            product.setCode(codeGenerator.getNextId(codeConfig));
            return productDao.save(product);
        });

        return new ResourceLink(product.getId(), "/products/"+product.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Product product, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update product details", UsecaseList.UPDATE_PRODUCT);

        Optional<Product> optionalProduct = productDao.findById(id);
        if(optionalProduct.isEmpty()) throw new ObjectNotFoundException("Product not found");
        Product oldProduct = optionalProduct.get();

        product.setId(id);
        product.setCode(oldProduct.getCode());
        product.setCreator(oldProduct.getCreator());
        product.setTocreation(oldProduct.getTocreation());


        EntityValidator.validate(product);

        ValidationErrorBag errorBag = new ValidationErrorBag();
        for(Productmaterial productmaterial : product.getProductmaterialList()) productmaterial.setProduct(product);

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        product = productDao.save(product);
        return new ResourceLink(product.getId(), "/products/"+product.getId());
    }
    @GetMapping("/{id}/photo")
    public HashMap<String,String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request,"No privilege to get product photo", UsecaseList.SHOW_PRODUCT_DETAILS);

        Optional<Product> optionalProduct = productDao.findById(id);
        if (optionalProduct.isEmpty()) throw new ObjectNotFoundException("Product not found");
        Product product = optionalProduct.get();

        Optional<File> optionalFile = fileDao.findFileById(product.getPhoto());

        if (optionalFile.isEmpty()){
            throw new ObjectNotFoundException("Not founded");
        }

        File photo = optionalFile.get();
        HashMap<String,String> data =new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }

}
