import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CustomerSettings {

  constructor(private http: HttpClient) { };
  private currentModel: string = 'None';
  public pageSize: number = 15;
  public currentPage: number = 0;
  public currentSearch: string = "";
  dataFilter: any = {};
  cartTotalTrigger = new BehaviorSubject({ count: 0, total: 0 });
  loginLogoutTrigger = new Subject();

  page(page: number) {
    this.currentPage = page;
    this.dataFilter = { searchValue: this.currentSearch };
  }

  refresh() {
    this.page(this.currentPage);
  }

}
