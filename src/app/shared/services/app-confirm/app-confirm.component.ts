import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  template: `<h1 matDialogTitle>{{ data.title }}</h1>
    <div mat-dialog-content [innerHTML]="data.message"></div>
    <div mat-dialog-actions class="mt-1">
    <span fxFlex></span>
    <button 
    type="button"
    color="accent"
    mat-raised-button 
    (click)="dialogRef.close(false)">{{ data.cancel }}</button>
    &nbsp;
    <button 
    type="button" 
    mat-raised-button
    color="primary" 
    (click)="dialogRef.close(true)">{{ data.ok }}</button>
    </div>`,
})
export class AppConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<AppConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}