import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Material} from '../../../../entities/material';
// import {ProductmaterialSubFormComponent} from '../../product/product-form/productmaterial-sub-form/productmaterial-sub-form.component';
import {Materialproduct} from '../../../../entities/materialproduct';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SupplierService} from '../../../../services/supplier.service';
import {MaterialService} from '../../../../services/material.service';
// import {ProductService} from '../../../../services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
// import {Product} from '../../../../entities/product';
import {DateHelper} from '../../../../shared/date-helper';
import {ResourceLink} from '../../../../shared/resource-link';
import {Product} from '../../../../entities/product';
import {Suppliertype} from '../../../../entities/suppliertype';
import {Producttype} from '../../../../entities/producttype';
import {Productcategory} from '../../../../entities/productcategory';
import {Productstatus} from '../../../../entities/productstatus';
import {Supplier} from '../../../../entities/supplier';
import {ProducttypeService} from '../../../../services/producttype.service';
import {ProductstatusService} from '../../../../services/productstatus.service';
import {ProductcategoryService} from '../../../../services/productcategory.service';
import {Materialtype} from '../../../../entities/materialtype';
import {Brand} from '../../../../entities/brand';
import {MaterialtypeService} from '../../../../services/materialtype.service';
import {ProductmaterialSubFormComponent} from '../../product/product-form/productmaterial-sub-form/productmaterial-sub-form.component';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent extends AbstractComponent implements OnInit {
  materials: Material[] = [];
  producttypes: Producttype[] = [];
  productstatuses: Productstatus[] = [];
  productcategories: Productcategory[] = [];
  // @ViewChild(ProductmaterialSubFormComponent) productmaterialSubForm: ProductmaterialSubFormComponent;

  @ViewChild(ProductmaterialSubFormComponent) productmaterialSubForm: ProductmaterialSubFormComponent;

  form = new FormGroup({
    name: new FormControl(null, [
      Validators.required,
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(2),
      Validators.max(10000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    created: new FormControl(null, [
    ]),
    productmaterials: new FormControl(),
    producttype: new FormControl(null, [
      Validators.required,
    ]),
   productstatus: new FormControl(null, [
     Validators.required,
   ]),
   productcategory: new FormControl(null, [
     Validators.required,
   ]),
    photo: new FormControl(),


    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
    // productmaterials: new FormControl(),
  });

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }
  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }
  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }
  get productmaterialsField(): FormControl{
    return this.form.controls.productmaterials as FormControl;
  }
  get producttypeField(): FormControl{
    return this.form.controls.producttype as FormControl;
  }
  // get productmaterialsField(): FormControl{
  //   return this.form.controls.productmaterials as FormControl;
  // }
  get createdField(): FormControl{
    return this.form.controls.regdate as FormControl;
  }


  get productstatusField(): FormControl{
   return this.form.controls.productstatus as FormControl;
 }
 get productcategoryField(): FormControl{
   return this.form.controls.productcategory as FormControl;
 }


  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }
  private producttpeservice: ProducttypeService;
  private productstatusservice: ProductstatusService;
  private productcategoryservice: ProductcategoryService;
  constructor(
    producttypeservice: ProducttypeService,
    private materialService: MaterialService,
    private productService: ProductService,
    productstatusservice: ProductstatusService,
    productcategoryservice: ProductcategoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
    this.producttpeservice = producttypeservice;
    this.productstatusservice = productstatusservice;
    this.productcategoryservice = productcategoryservice;
  }

  ngOnInit(): void {
    this.loadData();
    this.refreshData();
    this.loadMaterials();
  }

  async loadData(): Promise<any>{
    // this.productmaterialSubForm.resetForm();
    // this.productmaterialsField.markAsDirty();

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
    this.producttpeservice.getAll().then((producttypes) => {
      this.producttypes = producttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
    this.productstatusservice.getAll().then((productstatuses) => {
      this.productstatuses = productstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.updatePrivileges();
    if (!this.privilege.add) { return; }
    this.productcategoryservice.getAll().then((productcategories) => {
      this.productcategories = productcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });


  }


  // async loadMaterials(): Promise<void> {
  //   try {
  //     const materialDataPage = await this.materialService.getAllBasic(new PageRequest());
  //     this.materials = materialDataPage.content;
  //   } catch (e) {
  //     console.log(e);
  //     this.snackBar.open('Something went wrong while fetching materials', null, { duration: 2000 });
  //   }
  // }

  async loadMaterials(): Promise<void> {
    try {
      const materialDataPage = await this.materialService.getAllBasic(new PageRequest());
      this.materials = materialDataPage.content;
    } catch (e) {
      console.log(e);
      this.snackBar.open('Something is wrong', null, { duration: 2000 });
    }
  }
  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    this.productmaterialSubForm.resetForm();
    this.productmaterialsField.markAsDirty();

    if (this.form.invalid) { return; }




    const product: Product = new Product();
    // product.created = this.createdField.value ? DateHelper.getDateAsString(this.createdField.value) : null;
    product.producttype = this.producttypeField.value;
    product.productmaterialList = this.productmaterialsField.value;
    product.description = this.descriptionField.value;
    product.productcategory = this.productcategoryField.value;
    product.productstatus = this.productstatusField.value;
    product.qty = this.qtyField.value;
    product.name = this.nameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      product.photo = photoIds[0];
    }else {
      product.photo = null;
    }
    try{
      const resourceLink: ResourceLink = await this.productService.add(product);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/products/' + resourceLink.id);
      } else {
        this.form.reset();
        this.snackBar.open('Successfully saved', null, {duration: 2000});
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.producttype) { this.producttypeField.setErrors({server: msg.producttype}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.productstatus) { this.productstatusField.setErrors({server: msg.productstatus}); knownError = true; }
          // if (msg.productmaterialList) { this.productmaterialsField.setErrors({server: msg.productmaterialList}); knownError = true; }
          if (msg.productcategory) { this.productcategoryField.setErrors({server: msg.productcategory}); knownError = true; }
          if (msg.productmaterialList) { this.productmaterialsField.setErrors({server: msg.productmaterialList}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          // if (msg.created) { this.createdField.setErrors({server: msg.created}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (!knownError) {
            this.snackBar.open('Validation Error', null, {duration: 2000});
          }
          break;
        default:
          this.snackBar.open('Something is wrong', null, {duration: 2000});
      }
    }

  }


}
