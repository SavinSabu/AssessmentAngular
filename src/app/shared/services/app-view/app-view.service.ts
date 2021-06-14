import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';

import { AppViewComponent } from './app-view.component';

interface viewData {
  title?: string,
  html?: string,
  width?: string,
  close?: string
}

@Injectable()
export class AppViewService {

  constructor(private dialog: MatDialog) { }

  public view(data:viewData = {}): Observable<boolean> {
    data.title = data.title || 'Customer - Portfolio';
    data.html = data.html || '';
    data.close = data.close || 'Close';
    data.width = data.width || '500px';
    let dialogRef: MatDialogRef<AppViewComponent>;
    dialogRef = this.dialog.open(AppViewComponent, {
      width: data.width,
      disableClose: true,
      data: data
    });
    return dialogRef.afterClosed();
  }
}