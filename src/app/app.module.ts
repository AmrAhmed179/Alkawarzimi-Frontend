import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { VexModule } from "../@vex/vex.module";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { CustomLayoutModule } from "./shared/custom-layout/custom-layout.module";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CookieService } from "ngx-cookie-service";
import { MatCardModule } from "@angular/material/card";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatNativeDateModule, MAT_DATE_FORMATS } from "@angular/material/core";
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { MatGridListModule } from "@angular/material/grid-list";
import {DragDropModule} from '@angular/cdk/drag-drop';

import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { NgSelectModule } from "@ng-select/ng-select";
import { SecondaryToolbarModule } from "src/@vex/components/secondary-toolbar/secondary-toolbar.module";
import { BreadcrumbsModule } from "src/@vex/components/breadcrumbs/breadcrumbs.module";

import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { PageLayoutModule } from "src/@vex/components/page-layout/page-layout.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { DeleteModule } from "./shared/item-delete-model/delete.module";
import { APP_BASE_HREF, CommonModule } from "@angular/common";
import { MatTooltipModule } from "@angular/material/tooltip";
import { WidgetQuickValueCenterModule } from "src/@vex/components/widgets/widget-quick-value-center/widget-quick-value-center.module";
import { WidgetQuickValueStartModule } from "src/@vex/components/widgets/widget-quick-value-start/widget-quick-value-start.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { LoadingInterceptor } from "./core/interceptors/loading.interceptor";
import { BusyService } from "./core/services/busy.service";
import { NgxSpinnerModule } from "ngx-spinner";
import {
  CustomMatPaginatorIntl,
  GRI_DATE_FORMATS,
} from "./core/classes/custom-mat-paginator-int";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ToolbarUserModule } from "src/@vex/layout/toolbar/toolbar-user/toolbar-user.module";
import { BidiModule } from "@angular/cdk/bidi";
import { ToolbarModule } from "src/@vex/layout/toolbar/toolbar.module";
import { TransModule } from "./shared/trans.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { AuthGuard } from "./core/guards/auth.guard";
import { DataService } from "./core/services/data.service";
import { NotifyService } from "./core/services/notify.service";
import { ProjectService } from "./core/services/project.service";
import { UsersService } from "./core/services/users.service";
import { XSRFTokenInterceptor } from "./core/interceptors/XSRFTokenInterceptor";
import { SharedModule } from "./shared/shared.module";
import { AdminModule } from "./featuresModules/admin/admin.module";
import { AnaylaticsModule } from "./featuresModules/projects/anaylatics/anaylatics/anaylatics.module";
import { AppConfigService } from "./Services/app-config.service";
import { ClickOutsideModule } from 'ng-click-outside';
import { NotificationComponent } from "./shared/notification/notification.component";

export function initializeApp(appConfig: AppConfigService) {
  return () => appConfig.load();
}
@NgModule({
  declarations: [AppComponent,  NotificationComponent,
],
  imports: [
    DragDropModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatGridListModule,
    MatRadioModule,
    ClickOutsideModule,

    // Vex
    VexModule,
    CustomLayoutModule,
    //a
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    NoopAnimationsModule,
    MatDividerModule,
    MatInputModule,
    //
    NgSelectModule,
    SecondaryToolbarModule,
    BreadcrumbsModule,
    MatTableModule,
    MatTabsModule,
    PageLayoutModule,
    MatMenuModule,
    MatSlideToggleModule,
    //models
    DeleteModule,
    //end models
    CommonModule,
    MatProgressBarModule,
    MatTooltipModule,
    WidgetQuickValueCenterModule,
    WidgetQuickValueStartModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    // NgxMaterialTimepickerModule.setLocale("ar-SA"),
    ToolbarUserModule,
    ToolbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    // TransModule,
    // BidiModule,
    AdminModule,
    AnaylaticsModule
  ],
  providers: [
    ProjectService,
    DataService,
   // NotifyService,
    CookieService,
    UsersService,
    AuthGuard,
    BusyService,
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: XSRFTokenInterceptor, multi: true },
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
    { provide: MAT_DATE_FORMATS, useValue: GRI_DATE_FORMATS },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
