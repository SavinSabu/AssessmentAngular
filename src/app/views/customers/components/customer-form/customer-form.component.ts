import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { TopbarService } from 'app/shared/services/topbar.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'module-host tab-host' },
})
export class CustomerFormComponent implements OnInit {

  customerForm: FormGroup;
  loading: boolean;
  customer: any;
  data: any;
  selectedCustomerType = '';
  customerType = ['Individual', 'Corporate', 'Bank'];
  constructor(
    private router: Router,
    private topbarService: TopbarService,
    private activatedRouter: ActivatedRoute,
    private appLoader: AppLoaderService,
    private customerService: CustomerService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.topbarService.setupTopBar('customer-form', 0, false, [], false);
    const customer_id = this.activatedRouter.snapshot.paramMap.get('customerId');
    if (customer_id) {
      this.appLoader.open('Loading..');
      this.customerService.getCustomerDetails(customer_id).subscribe(
        (result) => {
          this.appLoader.close();
          this.customer = this.data = result[0];
          this.initCustomerForm();
          this.cd.detectChanges();
        },
        (error) => {
          this.appLoader.close();
          this.cd.detectChanges();
        }
      );
    }
  }

  customerList() {
    this.customerForm = null;
    this.router.navigate([`/customers`]);
  }

  initCustomerForm() {
      this.customerForm = new FormGroup({
        customerId: new FormControl(this.data.customerId),
        customerName: new FormControl(this.data.customerName, Validators.required),
        country: new FormControl(this.data.country),
        dateOfBirth: new FormControl(this.data.dateOfBirth ? this.data.dateOfBirth : new Date(), Validators.required),
        customAttr1: new FormControl(this.data.customAttr1 ? this.data.customAttr1 : ''),
        customAttr2: new FormControl(this.data.customAttr2 ? this.data.customAttr2 : ''),
        customAttr3: new FormControl(this.data.customAttr3 ? this.data.customAttr3 : ''),
        customAttr4: new FormControl(this.data.customAttr4 ? this.data.customAttr4 : ''),
        customAttr5: new FormControl(this.data.customAttr5 ? this.data.customAttr5 : ''),
        customAttr6: new FormControl(this.data.customAttr6 ? this.data.customAttr6 : ''),
        customerMeta: new FormGroup({
          ageVerified: new FormControl(this.data?.customerMeta?.ageVerified ? 1 : 0),
          customerType: new FormControl(this.data?.customerMeta?.customerType),
          expectedIncome: new FormControl(this.data?.customerMeta?.expectedIncome),
          idExpiry: new FormControl(this.data?.customerMeta?.idExpiry),
          nationality: new FormControl(this.data?.customerMeta?.nationality),
          sourceOfFunds: new FormControl(this.data?.customerMeta?.sourceOfFunds),
        })
      });
    this.selectedCustomerType = this.customerType.filter(x => x == this.data.customerMeta.customerType)[0];
  }

  save(customerForm) {
    this.customerService.saveCustomer(customerForm).subscribe(res => {
      console.log(res, 'res after save customer');
    });
  }

  onCustomerTypeChange(event) {
    this.selectedCustomerType = this.customerType.filter(x => x == event.value)[0];
    this.cd.detectChanges();
  }


}
