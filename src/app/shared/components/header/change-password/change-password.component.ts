import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AppConfig } from 'app/app.config';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {

  public changeForm: FormGroup;
  public user: any;
  public newType: boolean = false;
  public oldType: boolean = false;
  isLoading = false;
  constructor(
    private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.changeForm = new FormGroup({
      old_password: new FormControl("", Validators.required),
      new_password: new FormControl("", [Validators.required, Validators.pattern('^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()__+.]){1,}).{8,}$')])
    });
    this.user = AppConfig.settings.currentUserDetails;
  }

  save() {
    let old_password = this.changeForm.get('old_password').value;
    let new_password = this.changeForm.get('new_password').value;
    if (old_password && new_password) {
      console.log('change password component -> save()')
    }
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }
}
