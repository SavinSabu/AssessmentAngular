import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { companyAnimations } from 'app/shared/animations/company-animations';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { TopbarService } from 'app/shared/services/topbar.service';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  animations: companyAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'class': 'module-host' }
})
export class CustomerComponent implements OnInit, OnDestroy {

  customers;
  public loading = true;
  public pageSize;
  public currentPage = 0;
  public pageSubscription: Subscription;
  public addTriggerSubscription: Subscription;
  customerStatus = [];

  constructor(
    public topbarService: TopbarService,
    private customerService: CustomerService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef,
    private router: Router,
    private confirm: AppConfirmService,
    private elementView: ElementRef
  ) { }

  ngOnDestroy(): void {
    this.pageSubscription?.unsubscribe();
    this.addTriggerSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    setTimeout(() => {
      const containerHeight = this.elementView.nativeElement.offsetHeight;
      const count = Math.floor(containerHeight / 60);
      this.pageSize = count < 5 ? 5 : count;
      this.topbarService.setupTopBar('customers', 0, true, [], false, 'search|refresh');
      this.pageSubscription = this.topbarService.pageTrigger.subscribe(res => {
        if (res.model == 'customers') {
          this.loadCustomers(res.page, res.filter);
        }
      });
      this.addTriggerSubscription = this.topbarService.addTrigger.subscribe(res => {
        if (res.model == 'customers') {
          this.add();
        }
      });
    }, 2)
  }


  loadCustomers(page: number, filter: any) {
    this.loading = true;
    this.currentPage = page;
    this.customerService.getAllCustomers(page * this.pageSize, this.pageSize, filter).subscribe(customers => {
      if (customers) {
        this.customers = customers;
        this.topbarService.setPageTotal(customers['total']);
        this.loading = false;
        console.log(this.customers);
        this.cd.detectChanges();
      }
    }, (error) => {
      this.loading = false;
      this.cd.detectChanges();
    })
    this.cd.detectChanges();
  }
  edit(customer) {
    this.router.navigate(['/customer/edit', customer.customerId]);
  }
  delete(customer) {
    this.confirm.confirm({
      title: 'Confirm Deletion',
      message: 'Are you sure to delete customer <b>' + customer.customerName + '</b>?'
    }).subscribe(res => {
      if (res) {
        this.customerService.delete(customer.customer_id).subscribe(res => {
          if (res) {
            this.customers = this.customers.filter(obj => obj.customer_id != res.customer_id);
            this.cd.detectChanges();
          }
        })
      }
    })
  }
  view(customer) {
    this.router.navigate(['/customers/edit', customer.customerId]);
  }

  add() {
    this.router.navigate(['/customer/add']);
  }

  refresh() {
    this.loadCustomers(this.currentPage, '');
  }

  statusChange(customer) {
    const act_title = customer.customer_status ? 'De-activation' : 'Activation';
    const act_message = customer.customer_status ? 'de-activate' : 'activate';
    this.confirm.confirm({
      title: `Confirm ${act_title}`,
      message: `Are you sure to ${act_message} customer <b>${customer.customer_name}</b>?`
    }).subscribe(confirm => {
      if (confirm) {
        this.customerService.customerStatus(customer.customer_status, customer.customer_id).subscribe(res => {
          if (!res.status) {
            res.customer_status = !customer.customer_status;
            this.snackBar.open('Error in customer updation. Action failed.', 'Okay', { duration: 2500 });
            this.cd.detectChanges();
          }
        })
      } else {
        customer.customer_status = !customer.customer_status;
        this.cd.detectChanges();
      }
    });
  }
}
