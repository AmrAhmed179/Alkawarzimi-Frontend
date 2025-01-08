import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
} from "@angular/core";
import { LayoutService } from "../../services/layout.service";
import { ConfigService } from "../../config/config.service";
import { map, startWith, switchMap } from "rxjs/operators";
import { NavigationService } from "../../services/navigation.service";
import { PopoverService } from "../../components/popover/popover.service";
import { MegaMenuComponent } from "../../components/mega-menu/mega-menu.component";
import { Observable, of, Subscription } from "rxjs";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationStart,
  Params,
  Router,
  RoutesRecognized,
} from "@angular/router";
import { filter } from "rxjs/operators";
import {
  NavigationItem,
  NavigationLink,
  NavigationSubheading,
} from "src/@vex/interfaces/navigation-item.interface";
import { OptionsServiceService } from "src/app/Services/options-service.service";
import { NotifyService } from "src/app/core/services/notify.service";

@Component({
  selector: "vex-toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnDestroy {
  icon = "ksa";
  projectId:string;

  switchLang(lang: string) {
    if (lang == "ar") {
      this.icon = "ksa";
      this.configService.updateConfig({
        direction: "rtl",
      });
    } else {
      this.icon = "united-states";
      this.configService.updateConfig({
        direction: "ltr",
      });
    }
  }
  isProjects:boolean = false
  @Input() mobileQuery: boolean;
  @Input() projectName: string;
  @Input() role: string;

  @Input()
  @HostBinding("class.shadow-b")
  hasShadow: boolean;
  showProjects: boolean = false;
  @Input() showMenu: boolean;

  breadCrumbs = ["الرئيسية"];
  navigationItems = this.navigationService.items;
  isLink = this.navigationService.isLink;
  isDropdown = this.navigationService.isDropdown;
  isSubheading = this.navigationService.isSubheading;
  item: NavigationItem;

  isHorizontalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === "horizontal")
  );
  isVerticalLayout$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.layout === "vertical")
  );
  isNavbarInToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === "in-toolbar")
  );
  isNavbarBelowToolbar$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.navbar.position === "below-toolbar")
  );
  userVisible$: Observable<boolean> = this.configService.config$.pipe(
    map((config) => config.toolbar.user.visible)
  );

  megaMenuOpen$: Observable<boolean> = of(false);

  _itemsObservable = this.navigationService._itemsSubject
    .asObservable()
    .subscribe((list) => {
      this.navigationItems = this.navigationService.items;
      this.onLinkChange(location.hash, this.navigationItems);
    });
  direction$ = this.configService.config$.pipe(
    map((config) => config.direction)
  );
  subs: Array<Subscription> = [];
  constructor(
    private layoutService: LayoutService,
    private configService: ConfigService,
    private navigationService: NavigationService,
    private popoverService: PopoverService,
    private router: Router,
    private route: ActivatedRoute,
    private _optionService: OptionsServiceService,
    private notify: NotifyService,

  ) {
    this.buildBreadCrumbs();
    let y = window.location.href.split("/")
    if(y.includes('projects')){
      this.isProjects = true
      this.route.parent.params.subscribe((parmas:Params)=>{
        // debugger
        console.log("shared component inside params.subscribe")

        this.projectId = parmas["projectid"];
      })
    }
    // this.subs[0] = this.router.events
    //   .pipe(
    //     filter((event) => event instanceof NavigationEnd),
    //     map(() => this.route.snapshot),
    //     map((route) => {
    //       while (route.firstChild) {
    //         route = route.firstChild;
    //       }
    //       return route;
    //     })
    //   )
    //   .subscribe((route: ActivatedRouteSnapshot) => {
    //     console.log(route.data);
    //     if (route.data.breadcrumbs) this.breadCrumbs = route.data.breadcrumbs;
    //   });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.buildBreadCrumbs();
        let z = event as NavigationEnd;

        let currentRoute = z.urlAfterRedirects;
        if (currentRoute.indexOf("admin") !== -1) this.showProjects = true;

        // this.onLinkChange(currentRoute, this.navigationItems);
        console.log(event);
      });

    this.direction$.subscribe((dir) => {
      this.icon = dir === "rtl" ? "ksa" : "united-states";
    });

    /* this.navigationService.openLinkChange$.pipe(
        filter(() => this.isLink(this.item)),
        untilDestroyed(this)
      )
      .subscribe((item) => this.onOpenChange(item));*/
  }
  buildBreadCrumbs() {
    let route = this.route.snapshot;
    while (route.firstChild) {
      route = route.firstChild;
    }

    if (route.data.breadcrumbs) this.breadCrumbs = route.data.breadcrumbs;
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
  }
  onLinkChange(currentRoute: string, navigationItems: NavigationItem[]) {
    for (let i = 0; i < navigationItems.length; i++) {
      if (this.isLink(navigationItems[i])) {
        let itemLink = navigationItems[i] as NavigationLink;

        let itemroute = itemLink.route;
        itemroute = itemroute.replace(".", "");
        if (currentRoute.indexOf(itemroute) != -1) {
          this.breadCrumbs = itemLink.breadCrumbs;
          return;
        }
      } else {
        {
          let itemSubheading = navigationItems[i] as NavigationSubheading;
          this.onLinkChange(currentRoute, itemSubheading.children);
        }
      }
    }
  }

  nluTrain(){
    this._optionService.NluTrain(this.projectId).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar('Domain data Generated')
      }
    })
  }

  nluReload(){
    this._optionService.NluReload(this.projectId).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar('Engine Reloaded')
      }
    })
  }

  onOpenChange(item: NavigationLink) {}

  openQuickpanel(): void {
    this.layoutService.openQuickpanel();
  }

  openSidenav(): void {
    this.layoutService.openSidenav();
  }

  openMegaMenu(origin: ElementRef | HTMLElement): void {
    this.megaMenuOpen$ = of(
      this.popoverService.open({
        content: MegaMenuComponent,
        origin,
        offsetY: 12,
        position: [
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
          },
          {
            originX: "end",
            originY: "bottom",
            overlayX: "end",
            overlayY: "top",
          },
        ],
      })
    ).pipe(
      switchMap((popoverRef) => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true)
    );
  }

  openSearch(): void {
    this.layoutService.openSearch();
  }
}
