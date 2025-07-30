import { Component, Inject, LOCALE_ID, Renderer2 } from "@angular/core";
import { ConfigService } from "../@vex/config/config.service";
import { Settings } from "luxon";
import { DOCUMENT } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { NavigationService } from "../@vex/services/navigation.service";
import { LayoutService } from "../@vex/services/layout.service";
import { ActivatedRoute } from "@angular/router";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { SplashScreenService } from "../@vex/services/splash-screen.service";
import { VexConfigName } from "../@vex/config/config-name.model";
import { ColorSchemeName } from "../@vex/config/colorSchemeName";
import {
  MatIconRegistry,
  SafeResourceUrlWithIconOptions,
} from "@angular/material/icon";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import {
  ColorVariable,
  colorVariables,
} from "../@vex/components/config-panel/color-variables";

import { TranslateService } from "@ngx-translate/core";
import { combineLatest, forkJoin, map, skip } from "rxjs";
import { DateAdapter } from "@angular/material/core";
import { DataService } from "./core/services/data.service";
import { NotifyService } from "./core/services/notify.service";

@Component({
  selector: "vex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  message = '';
  type: 'success' | 'error' | 'CHUNKING'|'INGESTING'|'EMBEDDING'|'LOADING' | 'STARTING' = 'success';
  projectId = "ewewqewqe";
  currentLang = "";
  direction$ = this.configService.config$.pipe(
    skip(1),
    map((config) => config.direction)
  );
  constructor(
    private configService: ConfigService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private layoutService: LayoutService,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private splashScreenService: SplashScreenService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private _dataSerivce: DataService,
    private translationService: TranslateService,
    private dateAdapter: DateAdapter<Date>,
    private notificationService: NotifyService,
  ) {
    this.notificationService.notification$.subscribe(data => {
      this.message = data.message;
      this.type = data.type;
    });
    this.currentLang = localStorage.getItem("lang");

    if (!this.currentLang) this.currentLang = "en";

    translationService.addLangs(["en", "ar"]);
    translationService.setDefaultLang(this.currentLang);

    let dir: string = localStorage.getItem("dir");
    if (!dir) dir = "ltr";

    this.configService.updateConfig({
      direction: dir == "rtl" ? "rtl" : "ltr",
    });

    this.direction$.subscribe((dir) => {
      console.log(dir);
      let lang = dir === "ltr" ? "en" : "ar";
      console.log(lang);

      this.translationService.use(lang);

      this.dateAdapter.setLocale(lang);

      localStorage.setItem("lang", lang);
      localStorage.setItem("dir", dir);
    });

    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, "is-blink");
    }

    this.matIconRegistry.addSvgIconResolver(
      (
        name: string,
        namespace: string
      ): SafeResourceUrl | SafeResourceUrlWithIconOptions | null => {
        switch (namespace) {
          case "mat":
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `/assets/img/icons/material-design-icons/two-tone/${name}.svg`
            );

          case "logo":
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `/assets/img/icons/logos/${name}.svg`
            );

          case "flag":
            return this.domSanitizer.bypassSecurityTrustResourceUrl(
              `/assets/img/icons/flags/${name}.svg`
            );
        }
      }
    );

    /**
     * Customize the template to your needs with the ConfigService
     * Example:
     *  this.configService.updateConfig({
     *    sidenav: {
     *      title: 'Custom App',
     *      imageUrl: '//placehold.it/100x100',
     *      showCollapsePin: false
     *    },
     *    footer: {
     *      visible: false
     *    }
     *  });
     */

    /**
     * Config Related Subscriptions
     * You can remove this if you don't need the functionality of being able to enable specific configs with queryParams
     * Example: example.com/?layout=apollo&style=default
     */


    this.configService.updateConfig({
      imgSrc:'../assets/img/Alkhawarizmi-logo-white-2.png',
      sidenav: {
        title:"SSO Accounts",
        imageUrl: '../assets/img/Alkhawarizmi-logo-white-2.png',
        showCollapsePin: true,
        user: {
          visible: true,
        },
        search: {
          visible: false,
        },
        state:'expanded',
      },toolbar:{
        user:{
          visible:false
        }
      }
    })
    this.route.queryParamMap.subscribe((queryParamMap) => {
      if (queryParamMap.has("layout")) {
        this.configService.setConfig(
          queryParamMap.get("layout") as VexConfigName
        );
      }

      if (queryParamMap.has("style")) {
        this.configService.updateConfig({
          style: {
            colorScheme: queryParamMap.get("style") as ColorSchemeName,
          },
        });
      }

      if (queryParamMap.has("primaryColor")) {
        const color: ColorVariable =
          colorVariables[queryParamMap.get("primaryColor")];

        if (color) {
          this.configService.updateConfig({
            style: {
              colors: {
                primary: color,
              },
            },
          });
        }
      }

      if (queryParamMap.has("rtl")) {
        this.configService.updateConfig({
          direction: coerceBooleanProperty(queryParamMap.get("rtl"))
            ? "rtl"
            : "ltr",
        });
      }
    });

    /**
     * Add your own routes here
     */

    /*
  when all observables complete, provide the last
  emitted value from each as dictionary
*/
  }
}
