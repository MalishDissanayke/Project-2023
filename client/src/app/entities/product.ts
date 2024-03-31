import {Supplier} from './supplier';

import {Productstatus} from './productstatus';
import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Material} from './material';
import {Materialproduct} from './materialproduct';

import {Productcategory} from './productcategory';
import {Producttype} from './producttype';
import {Productmaterial} from './productmaterial';

export class Product {
  id: number;
  code: string;
  name: string;
<<<<<<< HEAD
  doordered: string;
  dorequired: string;
  doreceived: string;
  supplier: Supplier;
=======
  qty: number;
  photo: string;
  material: Material;
>>>>>>> parent of 27f0006 (Working version)
  productstatus: Productstatus;
  productcategory: Productcategory;
  productmaterialList: Productmaterial[];
  producttype: Producttype;
  description: string;
  creator: User;
  tocreation: string;
}

export class ProductDataPage extends DataPage{
  content: Product[];
}
