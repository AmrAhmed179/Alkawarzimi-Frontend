import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidenavItemComponent } from "./sidenav-item.component";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";
import { HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

@NgModule({
  declarations: [SidenavItemComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatRippleModule,
    TranslateModule,
  ],
  exports: [SidenavItemComponent],
})
export class SidenavItemModule {}

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
