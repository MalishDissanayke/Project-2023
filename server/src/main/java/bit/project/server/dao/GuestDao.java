package bit.project.server.dao;

import bit.project.server.entity.Guest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface GuestDao extends JpaRepository<Guest, Integer>{
    @Query("select new Guest (e.id,e.code,e.nametitle,e.callingname,e.photo) from Guest e")
    Page<Guest> findAllBasic(PageRequest pageRequest);

    @Query("select new Guest (e.id,e.code,e.nametitle,e.callingname,e.photo) from Guest e where e.gueststatus.id = 1 " )
    Page<Guest> findAllByGueststatus(PageRequest pageRequest);

    Guest findByCode(String code);
    Guest findByNic(String nic);
    Guest findByMobile(String mobile);
    Guest findByEmail(String email);

}
