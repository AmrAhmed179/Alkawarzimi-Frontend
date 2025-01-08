import { NgModule } from "@angular/core";
import { CommonModule, registerLocaleData } from "@angular/common";
import localeEn from "@angular/common/locales/en";
import localeAr from "@angular/common/locales/ar-SA";
import { LayoutModule } from "../../../@vex/layout/layout.module";
import { CustomLayoutComponent } from "./custom-layout.component";
import { SidenavModule } from "../../../@vex/layout/sidenav/sidenav.module";
import { ToolbarModule } from "../../../@vex/layout/toolbar/toolbar.module";
import { FooterModule } from "../../../@vex/layout/footer/footer.module";
import { ConfigPanelModule } from "../../../@vex/components/config-panel/config-panel.module";
import { SidebarModule } from "../../../@vex/components/sidebar/sidebar.module";
import { QuickpanelModule } from "../../../@vex/layout/quickpanel/quickpanel.module";

import { DateAdapter } from "@angular/material/core";
import { CustomDatePickerAdapter } from "../date-adapter";
import { TranslateModule } from "@ngx-translate/core";
registerLocaleData(localeEn, "en");
registerLocaleData(localeAr, "ar");
@NgModule({
  declarations: [CustomLayoutComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SidenavModule,
    ToolbarModule,
    FooterModule,
    ConfigPanelModule,
    SidebarModule,
    QuickpanelModule,
    TranslateModule,
  ],
  providers: [{ provide: DateAdapter, useClass: CustomDatePickerAdapter }],
})
export class CustomLayoutModule {}
