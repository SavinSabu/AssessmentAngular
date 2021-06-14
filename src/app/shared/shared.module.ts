import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
// ONLY REQUIRED FOR **SIDE** NAVIGATION LAYOUT
import { HeaderComponent } from './components/header/header.component';
import { SidebarSideComponent } from './components/sidebar-side/sidebar-side.component';


// ALL TIME REQUIRED 
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { AppConfirmComponent } from './services/app-confirm/app-confirm.component';
import { AppPromptComponent } from './services/app-prompt/app-prompt.component';
import { AppViewComponent } from './services/app-view/app-view.component';
import { AppLoaderComponent } from './services/app-loader/app-loader.component';
import { SpeedDialComponent } from './components/speed-dial/speed-dial.component';

// DIRECTIVES
import { FontSizeDirective } from './directives/font-size.directive';
import { ScrollToDirective } from './directives/scroll-to.directive';
import { AppDropdownDirective } from './directives/dropdown.directive';
import { DropdownAnchorDirective } from './directives/dropdown-anchor.directive';
import { DropdownLinkDirective } from './directives/dropdown-link.directive';
import { CompanySideNavToggleDirective } from './directives/company-side-nav-toggle.directive';

// PIPES
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { ExcerptPipe } from "./pipes/excerpt.pipe";
import { GetValueByKeyPipe } from './pipes/get-value-by-key.pipe';
import { FirstCharPipe } from './pipes/first-char.pipe';
import { ToArrayPipe } from './pipes/to-array.pipe';

// SERVICES
import { ThemeService } from './services/theme.service';
import { LayoutService } from './services/layout.service';
import { RoutePartsService } from './services/route-parts.service';
import { AuthGuard } from './services/auth/auth.guard';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { AppPromptService } from './services/app-prompt/app-prompt.service';
import { AppViewService } from './services/app-view/app-view.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';
import { RDatePipe } from './pipes/r-date.pipe';
import { DistancePipe } from './pipes/distance.pipe';
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ChangePasswordComponent } from './components/header/change-password/change-password.component';
import { ScriptLoaderService } from './services/script-loader.service';
import { DateDiffPipe } from './pipes/date-diff.pipe';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ForbiddenStringValidatorDirective } from './directives/forbidden-string.directive';
import { IsObjectPipe } from './pipes/is-object.pipe';
import { SearchComponent } from './components/search/search.component';
import { ImageCropComponent } from './components/image-crop/image-crop.component';
import { CustomerLayoutComponent } from './components/layouts/customer-layout/customer-layout.component';
import { SortPipe } from './pipes/sort.pipe';
import { AutoMeasurePipe } from './pipes/auto-measure.pipe';
import { FooterComponent } from './components/footer/footer.component';
import { MaterialModule } from './material/material.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

const classesToInclude = [
  SidenavComponent,
  SpeedDialComponent,
  NotificationsComponent,
  SidebarSideComponent,
  HeaderComponent,
  FooterComponent,
  AdminLayoutComponent,
  CustomerLayoutComponent,
  AuthLayoutComponent,
  BreadcrumbComponent,
  AppConfirmComponent,
  AppPromptComponent,
  AppViewComponent,
  AppLoaderComponent,
  FontSizeDirective,
  ScrollToDirective,
  AppDropdownDirective,
  DropdownAnchorDirective,
  DropdownLinkDirective,
  CompanySideNavToggleDirective,
  ForbiddenStringValidatorDirective,
  RelativeTimePipe,
  SafeHtmlPipe,
  ExcerptPipe,
  GetValueByKeyPipe,
  FirstCharPipe,
  ToArrayPipe,
  SortPipe,
  IsObjectPipe,
  RDatePipe,
  DateDiffPipe,
  DistancePipe,
  SecondsToTimePipe,
  ChangePasswordComponent,
  SearchComponent,
  ImageCropComponent,
  AutoMeasurePipe,
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    TranslateModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatDialogModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatFormFieldModule
  ],
  entryComponents: [AppConfirmComponent, AppPromptComponent, AppViewComponent, AppLoaderComponent, ChangePasswordComponent, SearchComponent, ImageCropComponent, FooterComponent],
  providers: [
    ThemeService,
    LayoutService,
    RoutePartsService,
    AuthGuard,
    AppConfirmService,
    AppPromptService,
    AppViewService,
    AppLoaderService,
    ScriptLoaderService,
    MatDatepickerModule,
    RDatePipe
  ],
  declarations: classesToInclude,
  exports: classesToInclude
})
export class SharedModule { }
