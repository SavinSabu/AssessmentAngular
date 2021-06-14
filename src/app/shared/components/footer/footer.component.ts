import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TopbarService } from 'app/shared/services/topbar.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  host: {'class': " fxHide.gt-sm"}
})
export class FooterComponent implements OnInit {
  hasPaging: boolean = false;
  pageTriggerSubscription: Subscription;
  page: number = 0;
  pageSize: number = 15;
  pageTotal: number = 0;
  hasAddButton: boolean = false;
  showRefresh: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public topbarService: TopbarService
  ) { }

  ngOnInit(): void {
    this.topbarService.setupTrigger.subscribe(next => {
      this.hasPaging = false;
      this.showRefresh = false;
      this.pageSize = next.size;
      this.pageTotal = 0;
      if (this.paginator && this.paginator.pageIndex > 0) {
        this.paginator.firstPage();
      } else {
        this.topbarService.page(0);
      }
      this.hasAddButton = next.hasAdd;
      var res = next.custom.split("|");
      res.forEach(function (val, i, data) {
        this.showRefresh = val == 'refresh' ? true : this.showRefresh;
      }, this)
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
  }

  onPage(event: PageEvent) {
    this.topbarService.page(event.pageIndex);
  }
  add() {
    this.topbarService.add();
  }
  refresh() {
    this.topbarService.refresh();
  }

}
