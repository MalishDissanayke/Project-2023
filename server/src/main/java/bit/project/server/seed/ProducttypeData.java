package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class ProducttypeData extends AbstractSeedClass {
    public ProducttypeData(){
        addIdNameData(1, "Soap dispenser");
        addIdNameData(2, "Sanitizer");
        addIdNameData(3, "Detergent");
        addIdNameData(4, "Disinfectant");
        addIdNameData(5, "Cleaning cart");
        addIdNameData(6, "Cleaning brushes");
        addIdNameData(7, "Insect repelent");
        addIdNameData(8, "Soap");



    }
}
