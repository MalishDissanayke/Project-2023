import {User} from './user';
import {Gender} from './gender';
import {Nametitle} from './nametitle';
import {Civilstatus} from './civilstatus';
import {Designation} from './designation';
import {DataPage} from '../shared/data-page';
import {Gueststatus} from './gueststatus';

export class Guest {
  id: number;
  code: string;
  nametitle: Nametitle;
  callingname: string;
  civilstatus: Civilstatus;
  fullname: string;
  photo: string;
  dobirth: string;
  gender: Gender;
  nic: string;
  mobile: string;
  land: string;
  email: string;
  address: string;
  designation: Designation;
  dorecruit: string;
  gueststatus: Gueststatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class GuestDataPage extends DataPage{
    content: Guest[];
}
