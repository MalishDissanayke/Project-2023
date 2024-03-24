package bit.project.server.dao;

import bit.project.server.entity.Material;
import bit.project.server.entity.Product;
import bit.project.server.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDateTime;
import java.util.List;

@RepositoryRestResource(exported=false)
public interface ProductDao extends JpaRepository<Product, Integer> {

    Product findByCode(String code);
    Product findByName(String name);



   @Query("select new Product (p.id,p.name,p.code) from Product p")
    Page<Product> findAllBasic(PageRequest pageRequest);
//
//    @Query("select new Product (p.id,p.name,p.code) from Product p where p.tocreation>=:dateTime")
//    List<Product> findAllByToCreationAfter (@Param("dateTime") LocalDateTime datetime) ;
}
