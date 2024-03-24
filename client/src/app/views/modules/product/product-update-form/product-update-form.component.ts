import { Component, OnInit } from '@angular/core';
import {Material} from '../../../../entities/material';
import {Materialtype} from '../../../../entities/materialtype';
import {Brand} from '../../../../entities/brand';
import {Unit} from '../../../../entities/unit';
import {Materialstatus} from '../../../../entities/materialstatus';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MaterialtypeService} from '../../../../services/materialtype.service';
import {BrandService} from '../../../../services/brand.service';
import {UnitService} from '../../../../services/unit.service';
import {MaterialstatusService} from '../../../../services/materialstatus.service';
import {MaterialService} from '../../../../services/material.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Product} from '../../../../entities/product';
import {Producttype} from '../../../../entities/producttype';
import {Productstatus} from '../../../../entities/productstatus';
import {Productcategory} from '../../../../entities/productcategory';
import {ProducttypeService} from '../../../../services/producttype.service';
import {ProductstatusService} from '../../../../services/productstatus.service';
import {ProductService} from '../../../../services/product.service';
import {ProductcategoryService} from '../../../../services/productcategory.service';

@Component({
  selector: 'app-product-update-form',
  templateUrl: './product-update-form.component.html',
  styleUrls: ['./product-update-form.component.scss']
})
export class ProductUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  product: Product;

  producttypes: Producttype[] = [];
  productcategories: Productcategory[] = [];
  productstatuses: Productstatus[] = [];

  form = new FormGroup({
    producttype: new FormControl(null, [
      Validators.required,
    ]),
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    qty: new FormControl(null, [
      Validators.required,
      Validators.min(0),
      Validators.max(10000),
      Validators.pattern('^([0-9]{1,10}([.][0-9]{1,3})?)$'),
    ]),
    productcategory: new FormControl(null, [
      Validators.required,
    ]),
    photo: new FormControl(),
    productstatus: new FormControl('1', [
      Validators.required,
    ]),
  });

  get producttypeField(): FormControl{
    return this.form.controls.producttype as FormControl;
  }

  get nameField(): FormControl{
    return this.form.controls.name as FormControl;
  }
  get qtyField(): FormControl{
    return this.form.controls.qty as FormControl;
  }
  get productcategoryField(): FormControl{
    return this.form.controls.productcategory as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get productstatusField(): FormControl{
    return this.form.controls.productstatus as FormControl;
  }

  constructor(
    private producttypeService: ProducttypeService,
    private productcategoryService: ProductcategoryService,
    private productstatusService: ProductstatusService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe( async (params) => {
      this.selectedId =  + params.get('id');
      await this.loadData();
      this.refreshData();
    });
  }

  async loadData(): Promise<any>{

    this.updatePrivileges();
    if (!this.privilege.update) { return; }

    this.producttypeService.getAll().then((producttypes) => {
      this.producttypes = producttypes;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productcategoryService.getAll().then((productcategories) => {
      this.productcategories = productcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.productstatusService.getAll().then((productstatuses) => {
      this.productstatuses = productstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.product = await this.productService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.producttypeField.pristine) {
      this.producttypeField.setValue(this.product.producttype.id);
    }
    if (this.nameField.pristine) {
      this.nameField.setValue(this.product.name);
    }
    if (this.qtyField.pristine) {
      this.qtyField.setValue(this.product.qty);
    }
    if (this.photoField.pristine) {
      if (this.product.photo) { this.photoField.setValue([this.product.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.productcategoryField.pristine) {
      this.productcategoryField.setValue(this.product.productcategory.id);
    }
    if (this.productstatusField.pristine) {
      this.productstatusField.setValue(this.product.productstatus.id);
    }
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newproduct: Product = new Product();
    newproduct.producttype = this.producttypeField.value;
    newproduct.name = this.nameField.value;
    newproduct.qty = this.qtyField.value;
    newproduct.productcategory = this.productcategoryField.value;
    newproduct.productstatus = this.productstatusField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newproduct.photo = photoIds[0];
    }else{
      newproduct.photo = null;
    }
    try{
      const resourceLink: ResourceLink = await this.productService.update(this.selectedId, newproduct);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/products/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/products');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.producttype) { this.producttypeField.setErrors({server: msg.producttype}); knownError = true; }
          if (msg.name) { this.nameField.setErrors({server: msg.name}); knownError = true; }
          if (msg.qty) { this.qtyField.setErrors({server: msg.qty}); knownError = true; }
          if (msg.productcategory) { this.productcategoryField.setErrors({server: msg.productcategory}); knownError = true; }
          if (msg.productstatus) { this.productstatusField.setErrors({server: msg.productstatus}); knownError = true; }
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
