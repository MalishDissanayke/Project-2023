import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Guest, GuestDataPage} from '../entities/guest';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<GuestDataPage>{
    const url = pageRequest.getPageRequestURL('guests');
    const guestDataPage = await this.http.get<GuestDataPage>(ApiManager.getURL(url)).toPromise();
    guestDataPage.content = guestDataPage.content.map((guest) => Object.assign(new Guest(), guest));
    return guestDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<GuestDataPage>{
    const url = pageRequest.getPageRequestURL('guests/basic');
    const guestDataPage = await this.http.get<GuestDataPage>(ApiManager.getURL(url)).toPromise();
    guestDataPage.content = guestDataPage.content.map((guest) => Object.assign(new Guest(), guest));
    return guestDataPage;
  }

  async findAllByDesignationAndeAndGueststatus(pageRequest: PageRequest): Promise<GuestDataPage>{
    const url = pageRequest.getPageRequestURL('guests/findAllByDesignationAndeAndGueststatus');
    const guestDataPage = await this.http.get<GuestDataPage>(ApiManager.getURL(url)).toPromise();
    guestDataPage.content = guestDataPage.content.map((guest) => Object.assign(new Guest(), guest));
    return guestDataPage;
  }

  async get(id: number): Promise<Guest>{
    const guest: Guest = await this.http.get<Guest>(ApiManager.getURL(`guests/${id}`)).toPromise();
    return Object.assign(new Guest(), guest);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`guests/${id}`)).toPromise();
  }

  async add(guest: Guest): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`guests`), guest).toPromise();
  }

  async update(id: number, guest: Guest): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`guests/${id}`), guest).toPromise();
  }

  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`guests/${id}/photo`)).toPromise();
  }

}
