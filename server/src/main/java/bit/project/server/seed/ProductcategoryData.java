package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class ProductcategoryData extends AbstractSeedClass {
    public ProductcategoryData(){
        addIdNameData(1, "cleaning");
        addIdNameData(2, "hygiene");
        addIdNameData(3, "chemical repellents");

    }
}
