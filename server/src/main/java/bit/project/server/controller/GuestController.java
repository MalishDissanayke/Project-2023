package bit.project.server.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.FileDao;
import bit.project.server.entity.File;
import bit.project.server.entity.User;
import bit.project.server.entity.Guest;
import bit.project.server.dao.GuestDao;
import bit.project.server.util.helper.FileHelper;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Gueststatus;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/guests")
public class GuestController {

    @Autowired
    private GuestDao guestDao;

    @Autowired
    private FileDao fileDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public GuestController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("guest");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("EM");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Guest> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all guests", UsecaseList.SHOW_ALL_GUESTS);

        if(pageQuery.isEmptySearch()){
            return guestDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String callingname = pageQuery.getSearchParam("callingname");
        String nic = pageQuery.getSearchParam("nic");
        Integer gueststatusId = pageQuery.getSearchParamAsInteger("gueststatus");

        List<Guest> guests = guestDao.findAll(DEFAULT_SORT);
        Stream<Guest> stream = guests.parallelStream();

        List<Guest> filteredGuests = stream.filter(guest -> {
            if(code!=null)
                if(!guest.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(callingname!=null)
                if(!guest.getCallingname().toLowerCase().contains(callingname.toLowerCase())) return false;
            if(nic!=null)
                if(!guest.getNic().toLowerCase().contains(nic.toLowerCase())) return false;
            if(gueststatusId!=null)
                if(!guest.getGueststatus().getId().equals(gueststatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredGuests, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Guest> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all guests' basic data", UsecaseList.SHOW_ALL_GUESTS);
        return guestDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/findAllByGueststatus")
    public Page<Guest> findAllByDesignationAndeAndGueststatus(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all guests' basic data", UsecaseList.SHOW_ALL_GUESTS);
        return guestDao.findAllByGueststatus(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Guest get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get guest", UsecaseList.SHOW_GUEST_DETAILS, UsecaseList.UPDATE_GUEST);
        Optional<Guest> optionalGuest = guestDao.findById(id);
        if(optionalGuest.isEmpty()) throw new ObjectNotFoundException("Guest not found");
        return optionalGuest.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete guests", UsecaseList.DELETE_GUEST);

        try{
            if(guestDao.existsById(id)) guestDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this guest already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Guest guest, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new guest", UsecaseList.ADD_GUEST);

        guest.setTocreation(LocalDateTime.now());
        guest.setCreator(authUser);
        guest.setId(null);
        guest.setGueststatus(new Gueststatus(1));;


        EntityValidator.validate(guest);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(guest.getNic() != null){
            Guest guestByNic = guestDao.findByNic(guest.getNic());
            if(guestByNic!=null) errorBag.add("nic","nic already exists");
        }

        if(guest.getMobile() != null){
            Guest guestByMobile = guestDao.findByMobile(guest.getMobile());
            if(guestByMobile!=null) errorBag.add("mobile","mobile already exists");
        }

        if(guest.getEmail() != null){
            Guest guestByEmail = guestDao.findByEmail(guest.getEmail());
            if(guestByEmail!=null) errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            guest.setCode(codeGenerator.getNextId(codeConfig));
            return guestDao.save(guest);
        });

        return new ResourceLink(guest.getId(), "/guests/"+guest.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Guest guest, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update guest details", UsecaseList.UPDATE_GUEST);

        Optional<Guest> optionalGuest = guestDao.findById(id);
        if(optionalGuest.isEmpty()) throw new ObjectNotFoundException("Guest not found");
        Guest oldGuest = optionalGuest.get();

        guest.setId(id);
        guest.setCode(oldGuest.getCode());
        guest.setCreator(oldGuest.getCreator());
        guest.setTocreation(oldGuest.getTocreation());


        EntityValidator.validate(guest);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(guest.getNic() != null){
            Guest guestByNic = guestDao.findByNic(guest.getNic());
            if(guestByNic!=null)
                if(!guestByNic.getId().equals(id))
                    errorBag.add("nic","nic already exists");
        }

        if(guest.getMobile() != null){
            Guest guestByMobile = guestDao.findByMobile(guest.getMobile());
            if(guestByMobile!=null)
                if(!guestByMobile.getId().equals(id))
                    errorBag.add("mobile","mobile already exists");
        }

        if(guest.getEmail() != null){
            Guest guestByEmail = guestDao.findByEmail(guest.getEmail());
            if(guestByEmail!=null)
                if(!guestByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        guest = guestDao.save(guest);
        return new ResourceLink(guest.getId(), "/guests/"+guest.getId());
    }

    @GetMapping("/{id}/photo")
    public HashMap<String,String> getPhoto(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request,"No privilege to get guest photo", UsecaseList.SHOW_GUEST_DETAILS);

        Optional<Guest> optionalGuest = guestDao.findById(id);
        if (optionalGuest.isEmpty()) throw new ObjectNotFoundException("Guest not found");
        Guest guest = optionalGuest.get();

        Optional<File> optionalFile = fileDao.findFileById(guest.getPhoto());

        if (optionalFile.isEmpty()){
            throw new ObjectNotFoundException("Not founded");
        }

        File photo = optionalFile.get();
        HashMap<String,String> data =new HashMap<>();

        data.put("file", FileHelper.byteArrayToBase64(photo.getFile(), photo.getFilemimetype()));

        return data;
    }
}
