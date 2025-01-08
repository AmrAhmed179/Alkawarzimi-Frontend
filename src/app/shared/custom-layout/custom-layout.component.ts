import { Component, OnInit, ViewChild } from "@angular/core";
import { LayoutService } from "../../../@vex/services/layout.service";
import { filter, map, startWith } from "rxjs/operators";
import { NavigationEnd, Router } from "@angular/router";
import { checkRouterChildsData } from "../../../@vex/utils/check-router-childs-data";
import { BreakpointObserver } from "@angular/cdk/layout";
import { ConfigService } from "../../../@vex/config/config.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { SidebarComponent } from "../../../@vex/components/sidebar/sidebar.component";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DateAdapter } from "@angular/material/core";
import { DataService } from "../../core/services/data.service";

@UntilDestroy()
@Component({
  selector: "vex-custom-layout",
  templateUrl: "./custom-layout.component.html",
  styleUrls: ["./custom-layout.component.scss"],

})
export class CustomLayoutComponent implements OnInit {
  routeDataSub;
  projectName = "أم السعد";
  role = "admin";
  mode : boolean;
  direction$ = this.configService.config$.pipe(
    map((config) => config.direction)
  );
  sidenavCollapsed$ = this.layoutService.sidenavCollapsed$;
  isFooterVisible$ = this.configService.config$.pipe(
    map((config) => config.footer.visible)
  );
  isDesktop$ = this.layoutService.isDesktop$;

  toolbarShadowEnabled$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    startWith(null),
    map(() =>
      checkRouterChildsData(
        this.router.routerState.root.snapshot,
        (data) => data.toolbarShadowEnabled
      )
    )
  );

  @ViewChild("configpanel", { static: true }) configpanel: SidebarComponent;

  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dataService: DataService,
    private translationService: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.routeDataSub = this.activatedRoute.data.subscribe((x) =>{
      this.mode = x.adminMode
    }
    );
    this.layoutService.configpanelOpen$
      .pipe(untilDestroyed(this))
      .subscribe((open) =>
        open ? this.configpanel?.open() : this.configpanel?.close()
      );

    this.dataService.$project_bs.subscribe((response) => {
      if (response) {
        this.projectName = response.name;
      }
    });
    this.dataService.$user_bs.subscribe((response) => {
      if (response) {
        this.role = response.role;
      }
    });

    this.direction$.subscribe((dir) => {
      console.log(dir);
      let lang = dir === "ltr" ? "en" : "ar";
      console.log(lang);
      this.translationService.use(lang);
      this.dateAdapter.setLocale(lang);
    });
  }
}
