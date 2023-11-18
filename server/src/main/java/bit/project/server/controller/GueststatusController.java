package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Gueststatus;
import bit.project.server.dao.GueststatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/employeestatuses")
public class GueststatusController {

    @Autowired
    private GueststatusDao employeestatusDao;

    @GetMapping
    public List<Gueststatus> getAll(){
        return employeestatusDao.findAll();
    }
}
