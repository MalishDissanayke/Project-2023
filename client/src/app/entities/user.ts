import {Role} from './role';
import {DataPage} from '../shared/data-page';
import {Guest} from './guest';

export class User {
  id: number;
  roleList: Role[];
  username: string;
  password: string;
  status: string;
  tocreation: string;
  creator: User;
  photo: string;

  guest: Guest;

  static getDisplayName(user: User): string{
    if (user.guest) { return user.guest.code + '-' + user.guest.nametitle.name + ' ' + user.guest.callingname; }
    return user.username;
  }
}

export class UserDataPage extends DataPage{
  content: User[];
}
