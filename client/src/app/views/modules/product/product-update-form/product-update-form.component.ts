import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {PageRequest} from '../../../../shared/page-request';
import {ViewChild} from '@angular/core';
import {DateHelper} from '../../../../shared/date-helper';
import {ProductmaterialUpdateSubFormComponent} from './productmaterial-update-sub-form/productmaterial-update-sub-form.component';
import { Productstatus } from 'src/app/entities/productstatus';
import {Supplier} from "../../../../entities/supplier";
import {Product} from "../../../../entities/product";
import {SupplierService} from "../../../../services/supplier.service";
import {ProductstatusService} from "../../../../services/productstatus.service";
import {ProductService} from "../../../../services/product.service";

@Component({
  selector: 'app-product-update-form',
  templateUrl: './product-update-form.component.html',
  styleUrls: ['./product-update-form.component.scss']
})
export class ProductUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  product: Product;

  suppliers: Supplier[] = [];
  @ViewChild(ProductmaterialUpdateSubFormComponent) productmaterialUpdateSubForm: ProductmaterialUpdateSubFormComponent;
  productstatuses: Productstatus[] = [];

  form = new FormGroup({

    supplier: new FormControl(null, [
      Validators.required,
    ]),
    productmaterials: new FormControl(),
    productstatus: new FormControl('1', [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(5000),
    ]),
  });



  get supplierField(): FormControl{
    return this.form.controls.supplier as FormControl;
  }

  get productmaterialsField(): FormControl{
    return this.form.controls.productmaterials as FormControl;
  }

  get productstatusField(): FormControl{
    return this.form.controls.productstatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private supplierService: SupplierService,
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

    this.supplierService.getAllBasic(new PageRequest()).then((supplierDataPage) => {
      this.suppliers = supplierDataPage.content;
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



    if (this.supplierField.pristine) {
      this.supplierField.setValue(this.product.supplier.id);
    }
    if (this.productmaterialsField.pristine) {
      this.productmaterialsField.setValue(this.product.productmaterialList);
    }
    if (this.productstatusField.pristine) {
      this.productstatusField.setValue(this.product.productstatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.product.description);
    }
}

  async submit(): Promise<void> {
    this.productmaterialUpdateSubForm.resetForm();
    this.productmaterialsField.markAsDirty();
    if (this.form.invalid) { return; }

    const newproduct: Product = new Product();

    newproduct.supplier = this.supplierField.value;
    newproduct.productmaterialList = this.productmaterialsField.value;
    newproduct.productstatus = this.productstatusField.value;
    newproduct.description = this.descriptionField.value;
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

          if (msg.supplier) { this.supplierField.setErrors({server: msg.supplier}); knownError = true; }
          if (msg.productmaterialList) { this.productmaterialsField.setErrors({server: msg.productmaterialList}); knownError = true; }
          if (msg.productstatus) { this.productstatusField.setErrors({server: msg.productstatus}); knownError = true; }
          if (msg.description) { this.descriptionField.setErrors({server: msg.description}); knownError = true; }
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
