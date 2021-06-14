import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AppConfirmService } from 'app/shared/services/app-confirm/app-confirm.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationService } from 'app/shared/services/navigation.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.template.html'
})
export class SidenavComponent {
  @Input('items') public menuItems: any[] = [];
  @Input('hasIconMenu') public hasIconTypeMenuItem: boolean;
  @Input('iconMenuTitle') public iconTypeMenuTitle: string;
  constructor(
    private snackBar: MatSnackBar,
    private formDialog: MatDialog,
    private confirm: AppConfirmService,
    private navService: NavigationService,
    public translate: TranslateService,
  ) { }
}
