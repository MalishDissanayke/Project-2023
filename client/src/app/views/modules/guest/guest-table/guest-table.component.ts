import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PageRequest} from '../../../../shared/page-request';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Guest, GuestDataPage} from '../../../../entities/guest';
import {GuestService} from '../../../../services/guest.service';
import {Gueststatus} from '../../../../entities/gueststatus';
import {GueststatusService} from '../../../../services/gueststatus.service';

@Component({
  selector: 'app-guest-table',
  templateUrl: './guest-table.component.html',
  styleUrls: ['./guest-table.component.scss']
})
export class GuestTableComponent extends AbstractComponent implements OnInit {

  guestDataPage: GuestDataPage;
  displayedColumns: string[] = [];
  pageSize = 5;
  pageIndex = 0;

  gueststatuses: Gueststatus[] = [];

  codeField = new FormControl();
  callingnameField = new FormControl();
  nicField = new FormControl();
  gueststatusField = new FormControl();

  constructor(
    private gueststatusService: GueststatusService,
    private guestService: GuestService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super();
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
    pageRequest.addSearchCriteria('callingname', this.callingnameField.value);
    pageRequest.addSearchCriteria('nic', this.nicField.value);
    pageRequest.addSearchCriteria('gueststatus', this.gueststatusField.value);

    this.gueststatusService.getAll().then((gueststatuses) => {
      this.gueststatuses = gueststatuses;
    }).catch((e) => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });

    this.guestService.getAll(pageRequest).then((page: GuestDataPage) => {
      this.guestDataPage = page;
    }).catch( e => {
      console.log(e);
      this.snackBar.open('Something is wrong', null, {duration: 2000});
    });
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUEST);
  }

  setDisplayedColumns(): void{
    this.displayedColumns = [ 'photo', 'code', 'callingname', 'nic', 'designation', 'gueststatus'];

    if (this.privilege.delete) { this.displayedColumns.push('delete-col'); }
    if (this.privilege.update) { this.displayedColumns.push('update-col'); }
    if (this.privilege.showOne) { this.displayedColumns.push('more-col'); }
  }

  paginate(e): void{
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadData();
  }

  async delete(guest: Guest): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: guest.code + ' - ' + guest.nametitle.name + ' ' + guest.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }
      try {
        await this.guestService.delete(guest.id);
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
      this.loadData();
    });
  }
}
