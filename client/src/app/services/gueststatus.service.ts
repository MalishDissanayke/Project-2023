import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Gueststatus} from '../entities/gueststatus';

@Injectable({
  providedIn: 'root'
})
export class GueststatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Gueststatus[]>{
    const gueststatuses = await this.http.get<Gueststatus[]>(ApiManager.getURL('gueststatuses')).toPromise();
    return gueststatuses.map((gueststatus) => Object.assign(new Gueststatus(), gueststatus));
  }

}
