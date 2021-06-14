import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': "module-host" }
})
export class SignInComponent implements OnInit {

  subscriptionForm: FormGroup;
  
  constructor(
    private router: Router
  ) { }


  ngOnInit(): void {
    this.initFormGroups();
    console.log(this.subscriptionForm, "subscriptionForm")
  }

  initFormGroups() {
    this.subscriptionForm = new FormGroup({
      email: new FormControl(null, Validators.required)
    })
  }
  subscription() {
    // if subscript set localstorage for session login
    localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21lck5hbWUiOiJTYXZpbiBTYWJ1IiwiY3VzdG9tZXJJZCI6IjEyMzQ1In0.M9lDBL_eUU69ZFXUleBXhn6SZpu2Aml_5uQcpXs1SCg")
    this.router.navigate(['/customers'])
  }
  noSubscription() {
    localStorage.removeItem('token');
  }
}
