import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Supplier, SupplierDataPage} from '../../../../entities/supplier';
import {FormControl} from '@angular/forms';
import {SupplierService} from '../../../../services/supplier.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {Product, ProductDataPage} from '../../../../entities/product';
import {ProductService} from '../../../../services/product.service';
import {Brand} from '../../../../entities/brand';
import {Producttype} from '../../../../entities/producttype';
import {Productstatus} from '../../../../entities/productstatus';
import {Productcategory} from '../../../../entities/productcategory';
import {BrandService} from '../../../../services/brand.service';
import {ProducttypeService} from '../../../../services/producttype.service';
import {ProductstatusService} from '../../../../services/productstatus.service';
import {ProductcategoryService} from '../../../../services/productcategory.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent extends AbstractComponent implements OnInit {

  productDataPage: ProductDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;


  producttypes: Producttype[] = [];
  productstatuses: Productstatus[] = [];
  productcategories: Productcategory[] = [];


  codeField = new FormControl();
  nameField = new FormControl();
  qtyField = new FormControl();

  producttypeField = new FormControl();
  productstatusField = new FormControl();
  productcategoryField = new FormControl();

  private producttypeService: ProducttypeService;
  private productstatusService: ProductstatusService;
  private productcategoryService: ProductcategoryService;


  constructor(
    producttypeService: ProducttypeService,
    productstatusService: ProductstatusService,
    productcategoryService: ProductcategoryService,
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
    this.productService = productService;
    this.producttypeService = producttypeService;
    this.productstatusService = productstatusService;
    this.productcategoryService = productcategoryService;
  }

  async ngOnInit(): Promise<void> {

    await this.loadData();
    this.refreshData();
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();

    if (!this.privilege.showAll) { return; }
    this.setDisplayedColumns();

    const pageRequest = new PageRequest();
    pageRequest.pageIndex  = this.pageIndex;
    pageRequest.pageSize  = this.pageSize;

    pageRequest.addSearchCriteria('code', this.codeField.value);
    pageRequest.addSearchCriteria('name', this.nameField.value);
    pageRequest.addSearchCriteria('qty', this.qtyField.value);
    pageRequest.addSearchCriteria('producttype', this.producttypeField.value);
    pageRequest.addSearchCriteria('productstatus', this.productstatusField.value);
    pageRequest.addSearchCriteria('productcategory', this.productcategoryField.value);



    this.productService.getAll(pageRequest).then((page: ProductDataPage) => {
      this.productDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.producttypeService.getAll().then((producttypes) => {
      this.producttypes = producttypes;
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
    this.productcategoryService.getAll().then((productcategories) => {
      this.productcategories = productcategories;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_PRODUCT);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_PRODUCTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_PRODUCT_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_PRODUCT);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_PRODUCT);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = ['photo', 'name', 'code', 'producttype', 'productstatus', 'productcategory', 'quantity'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(product: Product): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: product.code + ' ' + product.name}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.productService.delete(product.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }

}