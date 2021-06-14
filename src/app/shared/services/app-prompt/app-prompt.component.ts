import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { min } from 'date-fns';

@Component({
  selector: 'app-prompt',
  template: `<h1 matDialogTitle>{{ data.title }}</h1>
    <div mat-dialog-content [innerHTML]="data.message"></div>
    <form [formGroup]="promptForm" (ngSubmit)="close()">
    <div mat-dialog-content class="mt-1">
    <mat-form-field class="full-width" *ngIf="data.inputType!=='date' && data.inputType!='textarea'">
    <input [type]="data.inputType" [min]="data.min" [max]="data.max" matInput [placeholder]="data.placeholder" [pattern]="data.regex"  [formControl]="promptForm.controls['input']" >
    </mat-form-field>
    <mat-form-field class="full-width" *ngIf="data.inputType=='date'">
    <input matInput readonly [matDatepicker]="picker" [placeholder]="data.placeholder" [formControl]="promptForm.controls['input']">
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
    <mat-form-field class="full-width" *ngIf="data.inputType=='textarea'">
    <textarea matInput rows="4" [placeholder]="data.placeholder" [pattern]="data.regex"  [formControl]="promptForm.controls['input']"></textarea>
    </mat-form-field></div>
    <div mat-dialog-actions>
    <span fxFlex></span>
    <button  type="button" color="accent" mat-raised-button (click)="dialogRef.close(false)">{{ data.cancel }}</button>
    &nbsp;
    <button type="submit" mat-raised-button color="primary" >{{ data.ok }}</button>
    </div>
    </form>`,
})
export class AppPromptComponent implements OnInit {
  promptForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AppPromptComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.data.type == this.data.type ? this.data.type : "text";
    let validators = [];
    if(this.data.required) {
      validators.push(Validators.required);
    }
    if(!isNaN(this.data.min) && this.data.inputType == 'number') {
      validators.push(Validators.min(this.data.min));
    }
    if(!isNaN(this.data.max) && this.data.inputType == 'number') {
      validators.push(Validators.max(this.data.max));
    }
    this.promptForm = new FormGroup({
      input: new FormControl(this.data.default, validators),
    });
  }

  close() {
    if (this.promptForm.valid) {
      this.dialogRef.close(this.promptForm.value);
    }
  }

}