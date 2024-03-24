package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class ProductstatusData extends AbstractSeedClass {
    public ProductstatusData(){
        addIdNameData(1, "Producing");
        addIdNameData(2, "Discontinued");

    }
}
