import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { AppConfirmComponent } from './app-confirm.component';

interface confirmData {
  title?: string,
  message?: string,
  ok?: string,
  cancel?: string,
}

@Injectable()
export class AppConfirmService {

  constructor(private dialog: MatDialog) { }

  public confirm(data:confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirmation Required';
    data.message = data.message || 'Are you sure?';
    data.ok = data.ok || 'OK';
    data.cancel = data.cancel || 'Cancel';
    let dialogRef: MatDialogRef<AppConfirmComponent>;
    dialogRef = this.dialog.open(AppConfirmComponent, {
      width: '500px',
      disableClose: true,
      data: data
    });
    return dialogRef.afterClosed();
  }
}