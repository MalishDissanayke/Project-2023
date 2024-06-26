package bit.project.server.dao;

import bit.project.server.entity.Producttype;
import bit.project.server.entity.Suppliertype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ProducttypeDao extends JpaRepository<Producttype, Integer> {
}
