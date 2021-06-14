import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'app/app.config';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './common.service';

interface IMenuItem {
  type: string; // Possible values: link/dropDown/icon/separator/extLink
  name?: string; // Used as display text for item and title for separator type
  state?: string; // Router state
  icon?: string; // Material icon name
  tooltip?: string; // Tooltip text
  disabled?: boolean; // If true, item will not be appeared in sidenav.
  sub?: IChildItem[]; // Dropdown items
  managesub?: boolean;
  badges?: IBadge[];
}
interface IChildItem {
  id?: number;
  type?: string;
  name: string; // Display text
  state?: string; // Router state
  icon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string; // primary/accent/warn/hex color codes(#fff000)
  value: string; // Display text
}

@Injectable()
export class NavigationService {
  iconMenu: IMenuItem[] = [];
  iconTypeMenuTitle = 'Frequently Accessed';
  menuItems = new BehaviorSubject<IMenuItem[]>(this.iconMenu);
  menuItems$ = this.menuItems.asObservable();
  constructor(
    private http: HttpClient,
    private translateService: TranslateService,
    private commonService: CommonService
  ) { }

  loadMenu() {
    let translateService = this.translateService;
    // this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/menu", { type: 'default' }).subscribe(data => {
    //   this.publishNavigationChange(data.menu);
    //   this.commonService.defaultValues = data.settings;
    //   data.menu.forEach(function (item) {
    //     if (item.sub && item.sub.length > 0) {
    //       item.sub.forEach(function (sub) {
    //           translateService.setTranslation('en', {
    //           [sub.name.toLowerCase().replace(/\W/g, "")]: sub.name
    //         }, true);
    //       })
    //     }
    //   })
    // });
  }
  publishNavigationChange(data) {
    this.menuItems.next(data);
  }
}
