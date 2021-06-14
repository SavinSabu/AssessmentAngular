import { Observable } from 'rxjs';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { AppPromptComponent } from './app-prompt.component';

interface promptData {
  title?: string,
  message?: string,
  inputType?: string,
  min?:number|string,
  max?:number|string,
  placeholder?: string,
  ok?: string,
  cancel?: string,
  default?: any,
  required?: boolean,
  regex?: RegExp
}

@Injectable()
export class AppPromptService {

  constructor(private dialog: MatDialog) { }

  public prompt(data:promptData = {}): Observable<any> {
    data.title = data.title || 'Data Required';
    data.message = data.message || 'Please enter Data';
    data.inputType = data.inputType || "text";
    data.min = !data.min || isNaN(parseFloat(data.min.toString()))? '' : data.min;
    data.max = !data.max || isNaN(parseFloat(data.max.toString())) ? '' : data.max;
    data.placeholder = data.placeholder || "Enter Response";
    data.ok = data.ok || 'OK';
    data.cancel = data.cancel || 'Cancel';
    data.default = data.default || '';
    data.required = data.required || true;
    data.regex = data.regex || null;
    let dialogRef: MatDialogRef<AppPromptComponent>;
    dialogRef = this.dialog.open(AppPromptComponent, {
      width: data.inputType == 'textarea' ? '500px' : '380px',
      disableClose: true,
      data: data
    });
    return dialogRef.afterClosed();
  }
}