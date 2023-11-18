package bit.project.server.dao;

import bit.project.server.entity.User;
import bit.project.server.util.jpasupplement.CriteriaQuerySupplement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;
import bit.project.server.entity.Guest;

@RepositoryRestResource(exported=false)
public interface UserDao extends JpaRepository<User, Integer>, CriteriaQuerySupplement<User> {
    @Query("select new User(u.id, u.username, u.guest) from User u")
    Page<User> findAllBasic(PageRequest pageRequest);

    @Query("select u from User u where  u.guest is null")
    User getSuperUser();

    User findByGuest(Guest guest);
    User findByUsername(String username);

    @Query("select new Guest(em.id, em.code, em.nametitle, em.callingname, em.photo) from Guest em where EXISTS (select u from User u where u.guest.id = em.id)")
    List<Guest> findAllUserGuests();

    @Query("select new Guest(em.id, em.code, em.nametitle, em.callingname, em.photo) from Guest em where NOT EXISTS (select u from User u where u.guest.id = em.id)")
    List<Guest> findAllNonUserGuests();


}
