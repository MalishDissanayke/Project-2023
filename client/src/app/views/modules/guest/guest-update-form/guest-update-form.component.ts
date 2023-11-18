import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {ResourceLink} from '../../../../shared/resource-link';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Guest} from '../../../../entities/guest';
import {GuestService} from '../../../../services/guest.service';
import {Gender} from '../../../../entities/gender';
import {Nametitle} from '../../../../entities/nametitle';
import {DateHelper} from '../../../../shared/date-helper';
import {Civilstatus} from '../../../../entities/civilstatus';
import {Designation} from '../../../../entities/designation';
import {GenderService} from '../../../../services/gender.service';
import {Gueststatus} from '../../../../entities/gueststatus';
import {NametitleService} from '../../../../services/nametitle.service';
import {CivilstatusService} from '../../../../services/civilstatus.service';
import {DesignationService} from '../../../../services/designation.service';
import {GueststatusService} from '../../../../services/gueststatus.service';

@Component({
  selector: 'app-guest-update-form',
  templateUrl: './guest-update-form.component.html',
  styleUrls: ['./guest-update-form.component.scss']
})
export class GuestUpdateFormComponent extends AbstractComponent implements OnInit {

  selectedId: number;
  guest: Guest;

  nametitles: Nametitle[] = [];
  civilstatuses: Civilstatus[] = [];
  genders: Gender[] = [];
  designations: Designation[] = [];
  gueststatuses: Gueststatus[] = [];

  form = new FormGroup({
    nametitle: new FormControl(null, [
      Validators.required,
    ]),
    callingname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    civilstatus: new FormControl(null, [
    ]),
    fullname: new FormControl(null, [
      Validators.required,
      Validators.minLength(null),
      Validators.maxLength(255),
    ]),
    photo: new FormControl(),
    dobirth: new FormControl(null, [
      Validators.required,
    ]),
    gender: new FormControl(null, [
      Validators.required,
    ]),
    nic: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(12),
      Validators.pattern('^(([0-9]{12})|([0-9]{9}[vVxX]))$'),
    ]),
    mobile: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    land: new FormControl(null, [
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern('^([0][0-9]{9})$'),
    ]),
    email: new FormControl(null, [
      Validators.minLength(5),
      Validators.maxLength(255),
      Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'),
    ]),
    address: new FormControl(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(65535),
    ]),
    designation: new FormControl(null, [
      Validators.required,
    ]),
    dorecruit: new FormControl(null, [
    ]),
    gueststatus: new FormControl('1', [
      Validators.required,
    ]),
    description: new FormControl(null, [
      Validators.minLength(null),
      Validators.maxLength(65535),
    ]),
  });

  get nametitleField(): FormControl{
    return this.form.controls.nametitle as FormControl;
  }

  get callingnameField(): FormControl{
    return this.form.controls.callingname as FormControl;
  }

  get civilstatusField(): FormControl{
    return this.form.controls.civilstatus as FormControl;
  }

  get fullnameField(): FormControl{
    return this.form.controls.fullname as FormControl;
  }

  get photoField(): FormControl{
    return this.form.controls.photo as FormControl;
  }

  get dobirthField(): FormControl{
    return this.form.controls.dobirth as FormControl;
  }

  get genderField(): FormControl{
    return this.form.controls.gender as FormControl;
  }

  get nicField(): FormControl{
    return this.form.controls.nic as FormControl;
  }

  get mobileField(): FormControl{
    return this.form.controls.mobile as FormControl;
  }

  get landField(): FormControl{
    return this.form.controls.land as FormControl;
  }

  get emailField(): FormControl{
    return this.form.controls.email as FormControl;
  }

  get addressField(): FormControl{
    return this.form.controls.address as FormControl;
  }

  get designationField(): FormControl{
    return this.form.controls.designation as FormControl;
  }

  get dorecruitField(): FormControl{
    return this.form.controls.dorecruit as FormControl;
  }

  get gueststatusField(): FormControl{
    return this.form.controls.gueststatus as FormControl;
  }

  get descriptionField(): FormControl{
    return this.form.controls.description as FormControl;
  }

  constructor(
    private nametitleService: NametitleService,
    private civilstatusService: CivilstatusService,
    private genderService: GenderService,
    private designationService: DesignationService,
    private gueststatusService: GueststatusService,
    private guestService: GuestService,
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

    this.nametitleService.getAll().then((nametitles) => {
      this.nametitles = nametitles;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.civilstatusService.getAll().then((civilstatuses) => {
      this.civilstatuses = civilstatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.genderService.getAll().then((genders) => {
      this.genders = genders;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.designationService.getAll().then((designations) => {
      this.designations = designations;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.gueststatusService.getAll().then((gueststatuses) => {
      this.gueststatuses = gueststatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
    this.guest = await this.guestService.get(this.selectedId);
    this.setValues();
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUEST);
  }

  discardChanges(): void{
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.setValues();
  }

  setValues(): void{
    if (this.nametitleField.pristine) {
      this.nametitleField.setValue(this.guest.nametitle.id);
    }
    if (this.callingnameField.pristine) {
      this.callingnameField.setValue(this.guest.callingname);
    }
    if (this.civilstatusField.pristine) {
      this.civilstatusField.setValue(this.guest.civilstatus.id);
    }
    if (this.fullnameField.pristine) {
      this.fullnameField.setValue(this.guest.fullname);
    }
    if (this.photoField.pristine) {
      if (this.guest.photo) { this.photoField.setValue([this.guest.photo]); }
      else { this.photoField.setValue([]); }
    }
    if (this.dobirthField.pristine) {
      this.dobirthField.setValue(this.guest.dobirth);
    }
    if (this.genderField.pristine) {
      this.genderField.setValue(this.guest.gender.id);
    }
    if (this.nicField.pristine) {
      this.nicField.setValue(this.guest.nic);
    }
    if (this.mobileField.pristine) {
      this.mobileField.setValue(this.guest.mobile);
    }
    if (this.landField.pristine) {
      this.landField.setValue(this.guest.land);
    }
    if (this.emailField.pristine) {
      this.emailField.setValue(this.guest.email);
    }
    if (this.addressField.pristine) {
      this.addressField.setValue(this.guest.address);
    }
    if (this.designationField.pristine) {
      this.designationField.setValue(this.guest.designation.id);
    }
    if (this.dorecruitField.pristine) {
      this.dorecruitField.setValue(this.guest.dorecruit);
    }
    if (this.gueststatusField.pristine) {
      this.gueststatusField.setValue(this.guest.gueststatus.id);
    }
    if (this.descriptionField.pristine) {
      this.descriptionField.setValue(this.guest.description);
    }
  }

  async submit(): Promise<void> {
    this.photoField.updateValueAndValidity();
    this.photoField.markAsTouched();
    if (this.form.invalid) { return; }

    const newguest: Guest = new Guest();
    newguest.nametitle = this.nametitleField.value;
    newguest.callingname = this.callingnameField.value;
    newguest.civilstatus = this.civilstatusField.value;
    newguest.fullname = this.fullnameField.value;
    const photoIds = this.photoField.value;
    if (photoIds !== null && photoIds !== []){
      newguest.photo = photoIds[0];
    }else{
      newguest.photo = null;
    }
    newguest.dobirth = DateHelper.getDateAsString(this.dobirthField.value);
    newguest.gender = this.genderField.value;
    newguest.nic = this.nicField.value;
    newguest.mobile = this.mobileField.value;
    newguest.land = this.landField.value;
    newguest.email = this.emailField.value;
    newguest.address = this.addressField.value;
    newguest.designation = this.designationField.value;
    newguest.dorecruit = this.dorecruitField.value ? DateHelper.getDateAsString(this.dorecruitField.value) : null;
    newguest.gueststatus = this.gueststatusField.value;
    newguest.description = this.descriptionField.value;
    try{
      const resourceLink: ResourceLink = await this.guestService.update(this.selectedId, newguest);
      if (this.privilege.showOne) {
        await this.router.navigateByUrl('/guests/' + resourceLink.id);
      } else {
        await this.router.navigateByUrl('/guests');
      }
    }catch (e) {
      switch (e.status) {
        case 401: break;
        case 403: this.snackBar.open(e.error.message, null, {duration: 2000}); break;
        case 400:
          const msg = JSON.parse(e.error.message);
          let knownError = false;
          if (msg.nametitle) { this.nametitleField.setErrors({server: msg.nametitle}); knownError = true; }
          if (msg.callingname) { this.callingnameField.setErrors({server: msg.callingname}); knownError = true; }
          if (msg.civilstatus) { this.civilstatusField.setErrors({server: msg.civilstatus}); knownError = true; }
          if (msg.fullname) { this.fullnameField.setErrors({server: msg.fullname}); knownError = true; }
          if (msg.photo) { this.photoField.setErrors({server: msg.photo}); knownError = true; }
          if (msg.dobirth) { this.dobirthField.setErrors({server: msg.dobirth}); knownError = true; }
          if (msg.gender) { this.genderField.setErrors({server: msg.gender}); knownError = true; }
          if (msg.nic) { this.nicField.setErrors({server: msg.nic}); knownError = true; }
          if (msg.mobile) { this.mobileField.setErrors({server: msg.mobile}); knownError = true; }
          if (msg.land) { this.landField.setErrors({server: msg.land}); knownError = true; }
          if (msg.email) { this.emailField.setErrors({server: msg.email}); knownError = true; }
          if (msg.address) { this.addressField.setErrors({server: msg.address}); knownError = true; }
          if (msg.designation) { this.designationField.setErrors({server: msg.designation}); knownError = true; }
          if (msg.dorecruit) { this.dorecruitField.setErrors({server: msg.dorecruit}); knownError = true; }
          if (msg.gueststatus) { this.gueststatusField.setErrors({server: msg.gueststatus}); knownError = true; }
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
