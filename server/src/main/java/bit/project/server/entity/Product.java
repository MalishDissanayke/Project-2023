package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

<<<<<<< HEAD
    private String name;

    private LocalDate doordered;
=======
    private LocalDateTime tocreation;

>>>>>>> parent of 27f0006 (Working version)



    @Lob
    private String description;

    private String name;

    private Integer qty;

    private String photo;

    @ManyToOne
    @JsonIgnoreProperties({"creator", "status", "tocreation", "rolelist"})
    private User creator;

    @ManyToOne
    private Productstatus productstatus;

    @ManyToOne
    private Producttype producttype;

    @ManyToOne
    private Productcategory productcategory;

//    @JsonIgnore
//    @OneToMany(mappedBy = "product")
//    private List<Prorder> prorderList;


    @OneToMany(mappedBy="product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Productmaterial> productmaterialList;
    

    public Product(Integer id) {
        this.id = id;
    }

<<<<<<< HEAD
    public Product(Integer id, String code,String name , LocalDate doordered, LocalDate dorequired, Supplier supplier){
=======
    public Product(Integer id, String code, String name) {
>>>>>>> parent of 27f0006 (Working version)
        this.id = id;
        this.name=name;
        this.code = code;
        this.name = name;
    }



}
