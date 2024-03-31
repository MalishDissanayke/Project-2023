import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {Product, ProductDataPage} from '../entities/product';
<<<<<<< HEAD
import {Material} from '../entities/material';
=======
import {ApiManager} from '../shared/api-manager';
import {ResourceLink} from '../shared/resource-link';
import {Client, ClientDataPage} from '../entities/client';
import {Supplier, SupplierDataPage} from '../entities/supplier';

>>>>>>> parent of 27f0006 (Working version)

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ProductDataPage>{
    const url = pageRequest.getPageRequestURL('products');
    const productDataPage = await this.http.get<ProductDataPage>(ApiManager.getURL(url)).toPromise();
    productDataPage.content = productDataPage.content.map((product) => Object.assign(new Product(), product));
    return productDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ProductDataPage>{
    const url = pageRequest.getPageRequestURL('products/basic');
    const productDataPage = await this.http.get<ProductDataPage>(ApiManager.getURL(url)).toPromise();
    productDataPage.content = productDataPage.content.map((product) => Object.assign(new Product(), product));
    return productDataPage;
  }

  async get(id: number): Promise<Product>{
    const product: Product = await this.http.get<Product>(ApiManager.getURL(`products/${id}`)).toPromise();
    return Object.assign(new Product(), product);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`products/${id}`)).toPromise();
  }

  async add(product: Product): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`products`), product).toPromise();
  }

  async update(id: number, product: Product): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`products/${id}`), product).toPromise();
  }
  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`products/${id}/photo`)).toPromise();
  }


  async getAllMaterials(): Promise<Material[]> {
    const materials = await this.http.get<Material[]>(ApiManager.getURL('materials')).toPromise();
    return materials.map((material) => Object.assign(new Material(), material));
  }
}
