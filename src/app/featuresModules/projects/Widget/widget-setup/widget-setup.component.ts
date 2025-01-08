import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Params } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { ChatBotThemesService } from "src/app/Services/chat-bot-themes-service.service";
import { WidgetSetupService } from "src/app/Services/widget-setup-service.service";
import { SaveWidgetFile } from "src/app/core/models/save-widget-file";
import {
  BodyCompStyle,
  HeaderCompStyle,
  MessageListItems,
  RounededCorners,
  TextboxCompStyle,
  WidgetStyle,
  messageCompStyle,
} from "src/app/core/models/widgetsetup-model";
import { NotifyService } from "src/app/core/services/notify.service";
import { environment } from "src/environments/environment";
import { UpdateImagePathComponent } from "./update-image-path/update-image-path.component";

@Component({
  selector: "vex-widget-setup",
  templateUrl: "./widget-setup.component.html",
  styleUrls: ["./widget-setup.component.scss"],
})
export class WidgetSetupComponent implements OnInit, OnDestroy {
  selectedThemeId: string;
  themeSelected: WidgetStyle;
  chatBotId: string;
  selectedFile: File;
  backgroundImageURL: string;

  constructor(
    private widgetSetupService: WidgetSetupService,
    private ChatBotThemesService: ChatBotThemesService,
    private NotifyService: NotifyService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];

      this.getWidgetStyle().subscribe((widgetStyle: WidgetStyle) => {
        this.themeSelected = widgetStyle;
        this.getBackgroundImageURL();
      });
      this.widgetSetupService.changeWidgetCssStyles(this.themeSelected);
    });
  }

  //#region Appending Style Sheets
  appendingStyleSheets(theme) {
    this.widgetSetupService.setElementVisibility(false);
    const baseFileNames = ["base_lib", "base_style"];
    baseFileNames.forEach((fileName) => {
      this.ChatBotThemesService.getBaseLibStyleFile(
        fileName,
        this.chatBotId
      ).subscribe((content) => {
        if (fileName === "base_lib") {
          this.appendBaseLibStyles(content);
        } else if (fileName === "base_style") {
          this.appendBaseStyleStyles(content);
        }
        this.fixWidgetStyles();
        this.addAdditionalRules();
        this.widgetSetupService.changeWidgetCssStyles(theme);
        setTimeout(() => {
          this.widgetSetupService.setElementVisibility(true);
        }, 701);
      });
    });
  }

  appendBaseLibStyles(content) {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = content;
    styleElement.setAttribute("id", "widgetBaseLibSheet");
    document.head.appendChild(styleElement);
  }

  appendBaseStyleStyles(content) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      "<style>" + content + "</style>",
      "text/html"
    );
    const styleSheet = doc.getElementsByTagName("style")[0].sheet;

    const selectors = [
      { "h3, h4": ".message h3, .message h4" },
      { p: ".message p" },
      { "ul, ol": ".message ul, .message ol" },
      { "table, th, td": ".message table, .message th, .message td" },
      { body: "xbody" },
    ];

    for (let i = 0; i < styleSheet.cssRules.length; i++) {
      const rule = styleSheet.cssRules[i] as CSSStyleRule;
      for (const selectorObj of selectors) {
        const key = Object.keys(selectorObj)[0];
        const value = selectorObj[key];
        if (rule.selectorText === key) {
          const updatedRule = rule.cssText.replace(key, value);
          styleSheet.deleteRule(i);
          styleSheet.insertRule(updatedRule, i);
          break;
        }
      }
    }

    const updatedContent = Array.from(
      doc.getElementsByTagName("style")[0].sheet.cssRules
    )
      .map((rule) => rule.cssText)
      .join("");

    const styleElement = document.createElement("style");
    styleElement.innerHTML = updatedContent;
    styleElement.setAttribute("id", "widgetBaseStyleSheet");
    document.head.appendChild(styleElement);
  }

  fixWidgetStyles() {
    this.widgetSetupService.changeStyle(
      ".msg_block",
      "background-color",
      "transparent"
    );
  }

  addAdditionalRules() {
    const styleElm = document.getElementById(
      "widgetBaseLibSheet"
    ) as HTMLStyleElement;
    if (styleElm == undefined) return;
    const styleDocument = styleElm.sheet;
    const rules = [
      `.kha-heading-demo {}`,
      `.message-demo {}`,
      `.sender-demo {}`,
      `.menu-demo {}`,
      `.more-demo {}`,
      `.message-main-receiver-demo {}`,
      `.message-main-employee-demo {}`,
      `.message-time-demo {}`,
      `.reply-demo {}`,
      `.khaIcon-demo {}`,
      // `.org-logo {}`,
      // `#startSpeechId {}`,
      // `#sendMessage img {}`,
      // `#custServiceConnectId img {}`,
      // `#custServiceUploadAttmentId img {}`,
      `.message::-webkit-scrollbar {
        width: 7px !important;
      }`,
      // `.sender .message-text p, .sender .message-text {}`,
      // `.nicescroll-cursors { background: rgb(0, 0, 0) !important; }`,
    ];
    for (let i = 0; i < rules.length; i++) {
      styleDocument.insertRule(rules[i], styleDocument.cssRules.length);
    }
  }
  //#endregion

  //#region Update theme
  updateWidgetTheme() {
    const baseLib = document.getElementById("widgetBaseLibSheet")["sheet"];
    const baseStyle = document.getElementById("widgetBaseStyleSheet")["sheet"];

    const selectors = [
      { "h3, h4": ".message h3, .message h4" },
      { p: ".message p" },
      { "ul, ol": ".message ul, .message ol" },
      { "table, th, td": ".message table, .message th, .message td" },
      { body: "xbody" },
    ];

    this.updateRulesSelectors(baseStyle, selectors);

    let styleRules = [
      ".kha-heading-demo",
      ".message-demo",
      ".sender-demo",
      ".menu-demo",
      ".more-demo",
      ".message-main-receiver-demo",
      ".message-main-employee-demo",
      ".message-time-demo",
      ".reply-demo",
      ".khaIcon-demo",
      ".message::-webkit-scrollbar",
    ];
    this.deleteAdditionalRules(baseLib, styleRules);

    let fileNames = [];
    if (this.themeSelected.themeName.toLocaleLowerCase() === "default") {
      fileNames = [
        `lib_${this.themeSelected.chatBotID}.css`,
        `style_${this.themeSelected.chatBotID}.css`,
      ];
    } else {
      fileNames = [
        `lib_${this.themeSelected.themeName}_${this.themeSelected.chatBotID}.css`,
        `style_${this.themeSelected.themeName}_${this.themeSelected.chatBotID}.css`,
      ];
    }

    const contents = this.getStyleFileContents([baseLib, baseStyle]);

    const files = this.createWidgetFiles(fileNames, contents);

    this.ChatBotThemesService.updateTheme(
      this.selectedThemeId,
      this.themeSelected,
      files
    ).subscribe({
      next: (data: any) => {
        this.NotifyService.openSuccessSnackBar("Theme updated");
      },
      error: (error: any) => {
        this.NotifyService.openFailureSnackBar(error.message);
      },
    });

    const updatedSelectors = [
      { ".message h3, .message h4": "h3, h4" },
      { ".message p": "p" },
      { ".message ul, .message ol": "ul, ol" },
      { ".message table, .message th, .message td": "table, th, td" },
      { xbody: "body" },
    ];

    this.updateRulesSelectors(baseStyle, updatedSelectors);
  }

  updateRulesSelectors(styleSheet, selectors) {
    for (let i = 0; i < styleSheet.cssRules.length; i++) {
      const rule = styleSheet.cssRules[i] as CSSStyleRule;
      for (const selectorObj of selectors) {
        const key = Object.keys(selectorObj)[0];
        const value = selectorObj[key];
        if (rule.selectorText === value) {
          const updatedRule = rule.cssText.replace(value, key);
          styleSheet.deleteRule(i);
          styleSheet.insertRule(updatedRule, i);
          break;
        }
      }
    }
  }

  deleteAdditionalRules(styleSheet, rules) {
    for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
      const rule = styleSheet.cssRules[i] as CSSStyleRule;
      rules.forEach((cssrule) => {
        if (rule.selectorText === cssrule) {
          styleSheet.deleteRule(i);
        }
      });
    }
  }

  getStyleFileContents(styleFiles) {
    return styleFiles.map((styleFile) => {
      let content = "";
      for (let i = 0; i < styleFile.cssRules.length; i++) {
        content += styleFile.cssRules[i].cssText;
        content += "\n";
      }
      return content;
    });
  }

  createWidgetFiles(fileNames, contents) {
    return fileNames.map((fileName, index) => {
      return {
        fileName: fileName,
        fileContent: contents[index],
      };
    });
  }
  //#endregion

  onThemeSelected(theme: WidgetStyle) {
    if (theme._id != this.themeSelected._id) {
      this.removeStyles(theme);
      this.themeSelected = theme;
      this.selectedThemeId = theme._id.toString();
    }
  }

  getWidgetStyle(): Observable<WidgetStyle> {
    return this.widgetSetupService.config$;
  }

  reset() {
    this.ChatBotThemesService.getThemeByThemeId(
      this.themeSelected._id.toString()
    ).subscribe({
      next: (theme: any) => {
        if (theme.output.header == null)
          theme.output.header = {} as HeaderCompStyle;
        if (theme.output.body == null) theme.output.body = {} as BodyCompStyle;
        if (theme.output.body.message == null)
          theme.output.body.message = {} as messageCompStyle;
        if (theme.output.body.message.roundedCorners == null)
          theme.output.body.message.roundedCorners = {} as RounededCorners;
        if (theme.output.body.message.listItems == null)
          theme.output.body.message.listItems = {} as MessageListItems;
        if (theme.output.footer == null)
          theme.output.footer = {} as TextboxCompStyle;

        this.themeSelected = theme.output;
        this.selectedThemeId = this.themeSelected._id.toString();
        this.widgetSetupService.setConfig(this.themeSelected);
        this.removeStyles(this.themeSelected);
      },
      error: (error: any) => {
        console.log(error.message);
      },
    });
  }

  removeStyles(theme): void {
    this.removeStylesFromHead(document.getElementById("widgetBaseLibSheet"));
    this.removeStylesFromHead(document.getElementById("widgetBaseStyleSheet"));
    this.appendingStyleSheets(theme);
  }

  private removeStylesFromHead(styleElement): void {
    const headElement = document.getElementsByTagName("head")[0];
    if (styleElement) {
      headElement.removeChild(styleElement);
    }
  }
  files: SaveWidgetFile[] = [];
  openUpdateImagePath() {
    this.dialog
      .open(UpdateImagePathComponent)
      .afterClosed()
      .subscribe((path) => {
        if (path) {
          const baseLib =
            document.getElementById("widgetBaseLibSheet").textContent;
          const baseStyle = document.getElementById(
            "widgetBaseStyleSheet"
          ).textContent;
          const modifiedBaseLibCssContent = baseLib.replace(
            /"https:\/\/resources\.alkhwarizmi\.xyz\/ResourceHandler/g,
            '"' + path
          );
          const modifiedBaseStyleCssContent = baseStyle.replace(
            /"https:\/\/resources\.alkhwarizmi\.xyz\/ResourceHandler/g,
            '"' + path
          );

          this.files.push({
            fileName: `lib_${this.chatBotId}.css`,
            fileContent: modifiedBaseLibCssContent,
          });

          this.files.push({
            fileName: `style_${this.chatBotId}.css`,
            fileContent: modifiedBaseStyleCssContent,
          });

          this.ChatBotThemesService.updateImagesPath(this.files).subscribe(
            (res: any) => {
              if (res.statusCode === 1) {
                this.NotifyService.openSuccessSnackBar(res.message);
              } else {
                this.NotifyService.openFailureSnackBar(res.message);
              }
            }
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.removeStyles(null);
  }

  onFileSelected(event: any, imageName: string, selector: string) {
    this.selectedFile = event.target.files[0];
    // const backgroundImageURL = `${environment.URLS.GETRHImage}?chatBotId=${this.chatBotId}&channel=web&lang=ar&theme=${this.themeSelected.themeName}&id=bg_${this.chatBotId}`;
    const backgroundImageURL = `${environment.URLS.GETRHImage}?chatBotId=${this.chatBotId}&channel=web&lang=ar&theme=${this.themeSelected.themeName}&id=bg`;
    if (this.selectedFile && this.selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = reader.result as string;
        const imageUrl = base64Image;
        this.themeSelected.chatBotBackGroundImage = backgroundImageURL;
        const baseImagElement = document.querySelector(selector) as HTMLElement;

        baseImagElement.style.background = `url(${imageUrl})`;
      };
      reader.readAsDataURL(this.selectedFile);
    }
    event.target.value = "";
    // image name
    // imageName = `${imageName}_${this.chatBotId}`;
    imageName = `${imageName}`;
    this.ChatBotThemesService.uploadKHResource(
      imageName,
      this.selectedFile,
      this.chatBotId,
      this.themeSelected.themeName
    );
    this.getBackgroundImageURL();
  }

  getBackgroundImageURL() {
    // this.backgroundImageURL = `${environment.URLS.GETRHImage}?chatBotId=${this.chatBotId}&channel=web&lang=ar&theme=${this.themeSelected.themeName}&id=bg_${this.chatBotId}`;
    this.backgroundImageURL = `${environment.URLS.GETRHImage}?chatBotId=${this.chatBotId}&channel=web&lang=ar&theme=${this.themeSelected.themeName}&id=bg`;
  }
}
