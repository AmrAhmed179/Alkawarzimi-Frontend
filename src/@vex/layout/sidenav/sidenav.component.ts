import { Component, Input, OnInit } from "@angular/core";
import { NavigationService } from "../../services/navigation.service";
import { LayoutService } from "../../services/layout.service";
import { ConfigService } from "../../config/config.service";
import { map, startWith, switchMap } from "rxjs/operators";
import { NavigationLink } from "../../interfaces/navigation-item.interface";
import { PopoverService } from "../../components/popover/popover.service";
import { Observable, of } from "rxjs";
import { UserMenuComponent } from "../../components/user-menu/user-menu.component";
import { MatDialog } from "@angular/material/dialog";
import { SearchModalComponent } from "../../components/search-modal/search-modal.component";
import { AnalyticServiceService } from "src/app/Services/analytic-service.service";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { OptionsServiceService } from "src/app/Services/options-service.service";
import { ProjectOptionsModel } from "src/app/core/models/options-model";
import { UserModel } from "src/app/core/models/user-model";
import { DataService } from "src/app/core/services/data.service";

@Component({
  selector: "vex-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit {
  @Input() collapsed: boolean;
  user: UserModel = null;

  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(
    map((config) => config.sidenav.title)
  );
  imageUrl$ = this.configService.config$.pipe(
    map((config) => config.sidenav.imageUrl)
  );
  showCollapsePin$ = this.configService.config$.pipe(
    map((config) => config.sidenav.showCollapsePin)
  );
  userVisible$ = this.configService.config$.pipe(
    map((config) => config.sidenav.user.visible)
  );
  searchVisible$ = this.configService.config$.pipe(
    map((config) => config.sidenav.search.visible)
  );
  chatBotId:number
  projectName:string;
  selectedLang:string
  languages:string[] = []
  isProjects:any = false
  projectOptions:ProjectOptionsModel = null
  userMenuOpen$: Observable<boolean> = of(false);

  items = this.navigationService.items;

  _itemsObservable = this.navigationService._itemsSubject
    .asObservable()
    .subscribe((list) => {
      this.items = this.navigationService.items;
    });

  constructor(
    private navigationService: NavigationService,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private readonly popoverService: PopoverService,
    private readonly dialog: MatDialog,
    private _analyticalService:AnalyticServiceService,
    private _optionsService:OptionsServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private _dataService: DataService

  ) {

  }

  ngOnInit() {
    // debugger
    this.route.parent.params.subscribe((parmas:Params)=>{
      // debugger
      this._dataService.$user_bs.subscribe((response) => {
        //debugger
        if (response) this.user = response;
        console.log("toolbar-user" + response);
        console.log("toolbar-user" + this.user);
      });
      this.chatBotId = parmas["projectid"];
      this.getProjectLangAndName()
    })

    this._analyticalService.proJectName$.subscribe(res=>{
      this.projectName = res
    })
    let y = window.location.href.split("/")
    if(y.includes('projects')){
      this.isProjects = true
    }
  }



  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed
      ? this.layoutService.expandSidenav()
      : this.layoutService.collapseSidenav();
  }

  trackByRoute(index: number, item: NavigationLink): string {
    return item.route;
  }

  openProfileMenu(origin: HTMLDivElement): void {
    this.userMenuOpen$ = of(
      this.popoverService.open({
        content: UserMenuComponent,
        origin,
        offsetY: -8,
        width: origin.clientWidth,
        position: [
          {
            originX: "center",
            originY: "top",
            overlayX: "center",
            overlayY: "bottom",
          },
        ],
      })
    ).pipe(
      switchMap((popoverRef) => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true)
    );
  }

  openSearch(): void {
    this.dialog.open(SearchModalComponent, {
      panelClass: "vex-dialog-glossy",
      width: "100%",
      maxWidth: "600px",
    });
  }

  getProjectLangAndName(){
    this._optionsService.getProjectLangAndName(this.chatBotId).subscribe((res:any)=>{
      // debugger
      this.projectName = res.name;
      this.selectedLang = res.selectedLang;
      this._optionsService.selectedLang$.next(this.selectedLang )
      this._optionsService.languages$.next(res.languages)
      this._optionsService.languages$.subscribe(res=>{
        this.languages = res
      })
    })
  }
  setLanguage(lang){
    this.selectedLang  = lang
    this._optionsService.selectedLang$.next(this.selectedLang )
  }
}
