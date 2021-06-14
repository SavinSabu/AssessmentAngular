import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NavigationService } from "../../../shared/services/navigation.service";
import { ThemeService } from '../../services/theme.service';
import { Subscription } from "rxjs";
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-sidebar-side',
  templateUrl: './sidebar-side.component.html'
})
export class SidebarSideComponent implements OnInit, OnDestroy {
  public menuItems: any[];
  public hasIconTypeMenuItem: boolean;
  public iconTypeMenuTitle: string;
  private menuItemsSub: Subscription;
  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.navService.loadMenu();
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe(menuItem => {
      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(item => item.type === 'icon').length;
    });
  }
  ngOnDestroy() {
    if(this.menuItemsSub) {
      this.menuItemsSub.unsubscribe()
    }
  }
  logout()
  {
    this.loginService.logout();
  }

}
