import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DeleteConfirmDialogComponent} from '../../../../shared/views/delete-confirm-dialog/delete-confirm-dialog.component';
import {LoggedUser} from '../../../../shared/logged-user';
import {UsecaseList} from '../../../../usecase-list';
import {AbstractComponent} from '../../../../shared/abstract-component';
import {Guest} from '../../../../entities/guest';
import {GuestService} from '../../../../services/guest.service';

@Component({
  selector: 'app-guest-detail',
  templateUrl: './guest-detail.component.html',
  styleUrls: ['./guest-detail.component.scss']
})
export class GuestDetailComponent extends AbstractComponent implements OnInit {

  guest: Guest;
  selectedId: number;
  photo: any = null;

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private guestService: GuestService,
    private snackBar: MatSnackBar
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe( async (params) => {
      this.selectedId = + params.get('id');
      try{
        await this.loadData();
      } finally {
        this.initialLoaded();
        this.refreshData();
      }
    });
  }

  async delete(): Promise<void>{
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: {message: this.guest.code + '-' + this.guest.nametitle.name + ' ' + this.guest.callingname}
    });

    dialogRef.afterClosed().subscribe( async result => {
      if (!result) { return; }

      try {
        await this.guestService.delete(this.selectedId);
        await this.router.navigateByUrl('/guests');
      }catch (e) {
        this.snackBar.open(e.error.message, null, {duration: 4000});
      }
    });
  }

  async loadData(): Promise<any> {
    this.updatePrivileges();
    this.guest = await this.guestService.get(this.selectedId);

    if (this.guest.photo) {
      const photoOb = await this.guestService.getPhoto(this.selectedId);
      this.photo = photoOb.file;
    }else {
      this.photo = null;
    }
  }

  updatePrivileges(): any {
    this.privilege.add = LoggedUser.can(UsecaseList.ADD_GUEST);
    this.privilege.showAll = LoggedUser.can(UsecaseList.SHOW_ALL_GUESTS);
    this.privilege.showOne = LoggedUser.can(UsecaseList.SHOW_GUEST_DETAILS);
    this.privilege.delete = LoggedUser.can(UsecaseList.DELETE_GUEST);
    this.privilege.update = LoggedUser.can(UsecaseList.UPDATE_GUEST);
  }
}
