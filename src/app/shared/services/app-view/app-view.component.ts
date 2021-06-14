import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-view',
  template: `<h1 matDialogTitle>{{ data.title }}</h1>
    <div mat-dialog-content [innerHTML]="data.html"></div>
    <div mat-dialog-actions class="mt-1">
    &nbsp;
    <span fxFlex></span>
    <button 
    type="button"
    color="accent"
    mat-raised-button 
    (click)="dialogRef.close(false)">{{ data.close }}</button>
    </div>`,
})
export class AppViewComponent {
  constructor(
    public dialogRef: MatDialogRef<AppViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ) {}
}