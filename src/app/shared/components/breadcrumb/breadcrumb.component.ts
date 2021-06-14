import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ActivationStart, RouteConfigLoadStart, ActivationEnd } from '@angular/router';
import { RoutePartsService } from '../../../shared/services/route-parts.service';
import { LayoutService } from '../../../shared/services/layout.service';
import { Subscription } from "rxjs";
import { TopbarService } from 'app/shared/services/topbar.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AppConfig } from 'app/app.config';
import { filter } from 'rxjs/operators';
import 'rxjs/add/operator/debounceTime';
import { filterclass } from 'app/shared/models/filter.model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy, AfterViewInit {
  Status = new FormControl();
  filterClass = filterclass;
  status_title: string = "Status";
  statusList: any[] = [];
  lead_flag: string = '#ffffff';
  reportType: string = 'day';
  routeParts: any[];
  filled: boolean = false;
  hasPaging: boolean = false;
  searchFocused: boolean = false;
  routerEventSub: Subscription;
  titleTriggerSubscription: Subscription;
  customTitle: string = "";
  pageTriggerSubscription: Subscription;
  page: number = 0;
  pageSize: number = 15;
  pageTotal: number = 0;
  public statusFilterWidth: number = 320;
  searchForm: FormGroup;
  enableFlagFilter: boolean = false;
  enableSearch: boolean = false;
  enableDateRange: boolean = false;
  enableReportSelector: boolean = false;
  user: any;
  inAs: any;
  searchMode: string = 'Live';
  showSearch: boolean = false;
  hasAddButton: boolean = false;
  showRefresh: boolean = false;
  searchValue: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'This Year': [moment().startOf('year'), moment()]
  }
  selectedDateRange: any = { start: moment(), end: moment() };
  constructor(
    private router: Router,
    private routePartsService: RoutePartsService,
    private activeRoute: ActivatedRoute,
    public layout: LayoutService,
    public topbarService: TopbarService
  ) {
    this.router.events.subscribe((data:any) => {
      if (data && data.snapshot) {
        this.user = AppConfig.settings.currentUserDetails;
            this.routeParts = this.routePartsService.generateRouteParts(data.snapshot);
            // generate url from parts
            this.routeParts.reverse().map((item, i) => {
              item.breadcrumb = this.parseText(item);
              item.urlSegments.forEach((urlSegment, j) => {
                if (j === 0)
                  return item.url = `${urlSegment.path}`;
                item.url += `/${urlSegment.path}`
              });
              if (i === 0) {
                return item;
              }
              // prepend previous part to current part
              item.url = `${this.routeParts[i - 1].url}/${item.url}`;
              return item;
            });
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    // this.reportType = this.topbarService.reportType;
    this.searchForm = new FormGroup({
      search_value: new FormControl("", [Validators.required])
    });
    this.topbarService.setupTrigger.subscribe(next => {
      this.hasPaging = false;
      this.showSearch = this.showRefresh = this.enableDateRange = this.enableReportSelector = false;
      this.searchForm.controls['search_value'].setValue("");
      if (next.model === 'calendar') {
        this.layout.layoutConf.useBreadcrumb = false;
      } else {
        this.layout.layoutConf.useBreadcrumb = true;
      }
      // this.reportType = this.topbarService.reportType;
      this.pageSize = next.size;
      this.hasAddButton = next.hasAdd;
      this.pageTotal = 0;
      this.statusList = next.statusList && next.statusList.length > 0 ? next.statusList : [];
      this.enableFlagFilter = next.hasFalg ? next.hasFalg : false;
      var res = next.custom.split("|");
      res.forEach(function (val, i, data) {
        this.showSearch = val == 'search' ? true : this.showSearch;
        this.showRefresh = val == 'refresh' ? true : this.showRefresh;
        this.enableDateRange = val == 'daterange' ? true : this.enableDateRange;
        this.enableReportSelector = val == 'report' ? true : this.enableReportSelector;
      }, this)
      this.statusFilterWidth = 160 + next.statusList.length;
      if (this.paginator && this.paginator.pageIndex > 0) {
        this.paginator.firstPage();
      } else {
        this.topbarService.page(0);
      }
    });

    this.topbarService.pageSizeTrigger.subscribe(next => {
      this.pageSize = next;
    });
    this.topbarService.pageTotalTrigger.subscribe(next => {
      this.pageTotal = next;
      this.hasPaging = true;
    });
    this.pageTriggerSubscription = this.topbarService.pageTrigger.subscribe(value => {
      if (value.page == 0) { }
    });
    this.titleTriggerSubscription = this.topbarService.titleTrigger.subscribe(value => {
      this.customTitle = value;
    })
  }

  ngOnDestroy() {
    this.routerEventSub?.unsubscribe();
    this.pageTriggerSubscription?.unsubscribe();
  }

  onPage(event: PageEvent) {
    this.topbarService.page(event.pageIndex);
  }

  activeStatus() {
    return this.statusList.length && this.statusList.filter(x => x.active).length ? this.statusList.filter(x => x.active)[0].name : "Default";
  }


  flag(color) {
    this.lead_flag = color;
    this.topbarService.filterFlag(color);
    if (this.paginator && this.paginator.pageIndex > 0) {
      this.paginator.firstPage();
    } else {
      this.topbarService.page(0);
    }
  }

  filterStatus(status) {
    this.statusList = this.statusList.map(x => {
      x.active = x.val == status.val ? true : false;
      return x;
    })
    this.topbarService.filterStatus(this.statusList);
    if (this.paginator && this.paginator.pageIndex > 0) {
      this.paginator.firstPage();
    } else {
      this.topbarService.page(0);
    }
  }

  parseText(part) {
    part.breadcrumb = part.breadcrumb.replace(/{{([^{}]*)}}/g, function (a, b) {
      var r = part.params[b];
      return typeof r === 'string' ? r : a;
    });
    return part.breadcrumb;
  }
  blurSearch() {
    setTimeout(() => {
      this.filled = this.searchFocused || this.searchForm.controls['search'].value ? true : false;
    }, 800);
  }
  previous() {
    this.topbarService.previousTrigger.next("next");
  }
  next() {
    this.topbarService.nextTrigger.next("next");
  }
  search(event) {
    this.topbarService.search(event);
    this.paginator.pageIndex ? this.paginator.firstPage() : this.topbarService.page(0);
  }
  add() {
    this.topbarService.add();
  }
  refresh() {
    this.topbarService.refresh();
  }

}
