import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { HttpClient } from '@angular/common/http';
import { filter, search } from '../models/filter.model';

@Injectable({
  providedIn: 'root'
})

export class TopbarService {

  constructor(private http: HttpClient) { };
  private currentModel: string = 'None';
  private pageSize: number = 15;
  public currentPage: number = 0;
  public currentFlag: string = '#ffffff';
  public currentStatus: string = "";
  public currentSearch: string = "";
  public dateSelected: string = 'default';
  public inAs: any = {};
  hasAddButton: boolean = false;
  dataFilter: any = {}
  addTrigger = new Subject<any>();
  pageTrigger = new BehaviorSubject({ model: '', page: 0, size: 15, filter: this.dataFilter });
  pageSizeTrigger = new BehaviorSubject(15);
  titleTrigger = new BehaviorSubject('');
  subTitleTrigger = new BehaviorSubject('');
  previousTrigger = new BehaviorSubject('');
  nextTrigger = new BehaviorSubject('');
  attendTrigger = new BehaviorSubject('');
  pageTotalTrigger = new BehaviorSubject(0);
  customerFormTrigger = new BehaviorSubject<any>(false);
  customerMenuTrigger = new BehaviorSubject<any>({});
  setupTrigger = new BehaviorSubject({ model: '', size: 15, hasAdd: false, statusList: [], hasFalg: false, custom: '' });
  rfTrigger = new Subject<string>();
  sourcePageTrigger = new BehaviorSubject<string>("order");
  orderCustomerChangetrigger = new BehaviorSubject<number>(0);

  page(page: number) {
    this.currentPage = page;
    this.dataFilter = { flag: this.currentFlag, status: this.currentStatus, searchValue: this.currentSearch };
    this.pageTrigger.next({ model: this.currentModel, page: this.currentPage, size: this.pageSize, filter: this.dataFilter });
  }

  refresh() {
    this.page(this.currentPage);
  }

  filterFlag(flag) {
    this.currentFlag = flag;
  }

  attendance(date) {
    this.attendTrigger.next(date);
  }

  filterStatus(status: any[]) {
    let tmp = status.filter(x => x.active);
    this.currentStatus = tmp.length ? tmp[0].val : "";
  }

  setSize(size: number) {
    this.pageSize = size;
    this.pageSizeTrigger.next(size);
  }
  setupTopBar(model: string, size: number, hasAdd: boolean, statusList: filter[] = [], hasFlag: boolean = false, custom: string = '') {
    this.currentModel = model;
    this.currentPage = 0;
    this.pageSize = size;
    this.hasAddButton = hasAdd;
    this.currentStatus = "";
    this.currentSearch = "";
    this.titleTrigger.next("");
    this.setupTrigger.next({ model: model, size: size, hasAdd: hasAdd, statusList: statusList, hasFalg: hasFlag, custom: custom });
  }
  setTitle(title: string) {
    this.titleTrigger.next(title);
  }
  setSubTitle(title: string) {
    this.subTitleTrigger.next(title);
  }
  setPageTotal(totalCount: number) {
    this.pageTotalTrigger.next(totalCount);
  }
  search(value: string){
    this.currentSearch = value;
  }
  add(){
    this.addTrigger.next({ model: this.currentModel });
  }

}
