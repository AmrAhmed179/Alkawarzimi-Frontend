import { Component, DebugNode, EventEmitter, OnInit, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { WidgetSetupService } from "src/app/Services/widget-setup-service.service";
import {
  WidgetStyle,
  RounededCorners,
  HeaderCompStyle,
  messageCompStyle,
  MessageListItems,
  TextboxCompStyle,
  BodyCompStyle,
  mainMessageListItems,
} from "src/app/core/models/widgetsetup-model";
import { CreateNewThemeComponent } from "./create-new-theme/create-new-theme.component";
import { DeleteThemeComponent } from "./delete-theme/delete-theme.component";
import { ChatBotThemesService } from "src/app/Services/chat-bot-themes-service.service";
import { NotifyService } from "src/app/core/services/notify.service";
import { ActivatedRoute, Params } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
  selector: "vex-widget-controls",
  templateUrl: "./widget-controls.component.html",
  styleUrls: ["./widget-controls.component.scss"],
})
export class WidgetControlsComponent implements OnInit {
  isPanelExpanded = false;
  chatBotId: string;
  chatBotThemesWidget: WidgetStyle[] = [];
  fileName: string;
  selectedFile: File;
  @Output() themeSelected = new EventEmitter<WidgetStyle>();

  widgetStyle: WidgetStyle = {
    primaryColor: "#031d37",
    secondaryColor: "#031d37",
    chatBotBackGroundImage:
      "https://orchestrator.alkhwarizmi.xyz/Projects/bgs/bg_296.png",
    header: {
      primaryBgColor: "#031fd37",
      displayLogo: true,
      headerLogoUrl: "../../../assets/images/rb-avater.png",
      LogoutLogoUrl: "../../../assets/images/logout.png",
      minimizeLogoUrl:
        "https://orchestrator.alkhwarizmi.xyz/plugins/images/mdi_close.png",
      widgetAlignment: "left",
    },
    body: {
      backgroundColor: "#fff",
      displayLogo: true,
      message: {
        roundedCorners: {
          unit: "rem",
          value: 0,
        },
        displayTime: true,
        senderBackgroundColor: "#EBE9FC",
        receiverBackgroundColor: "#554ab3",
        listDisplay: "flex",
        CustomerServBackgroundColor: "#230871",
        listItems: {
          hoverTextColor: "#fff",
          roundedCorners: {
            unit: "rem",
            value: 0,
          },
          backgroundColor: "#000",
          textColor: "#fff",
          hoverBgColor: "#031D37",
        },
        mainListItems: {
          hoverTextColor: "#fff",
          roundedCorners: {
            unit: "rem",
            value: 0,
          },
          backgroundColor: "#000",
          textColor: "#fff",
          hoverBgColor: "#031D37",
        },
        userTextColor: "#000",
        botTextColor: "#fff",
        employeeTextColor: "#fff",
      },
      botAvatarUrl: "../../../assets/images/rb-avater.png",
      agentAvatarUrl: "../../../assets/images/employee_icon.png",
      moreTextColor: "#fff",
      noBackgroundColor: "#fff",
      noTextColor: "#fff",
      yesBackgroundColor: "#fff",
      yesTextColor: "#fff",
      noBorderColor: "#fff",
      yesBorderColor: "#fff",
    },
    footer: {
      recordingImageDisplay: true,
      recordingImageUrl: "../../../assets/images/microphone_150.png",
      textImageUrl: "../../../assets/images/sharelocation.png",
      attachingFileImageUrl: "../../../assets/images/attachment_icon_150.png",
      closeCustomerServiceImageUrl:
        "../../../assets/images/customer_service_close_150.png",
      sendingImageUrl: "../../../assets/images/send_150.png",
      activeBorderColor: "#fff",
      borderColor: "#fff",
    },
  };

  MessagesSelectedBorderRadius: RounededCorners = {
    unit: "rem",
    value: 0,
  };
  listItemssSelectedBorderRadius: RounededCorners = {
    unit: "rem",
    value: 0,
  };

  roundedCornerValues: RounededCorners[] = [
    { value: 0, unit: "rem" },
    { value: 1, unit: "rem" },
    { value: 1.5, unit: "rem" },
    { value: 2, unit: "rem" },
    { value: 2.5, unit: "rem" },
    { value: 3, unit: "rem" },
    { value: 3.5, unit: "rem" },
    { value: 4, unit: "rem" },
  ];

  panelsSelectors = [
    ".kha-heading-demo",
    ".message-demo",
    ".sender-demo",
    ".menu-demo li",
    ".smenu-demo",
    ".more-demo",
    ".message-main-receiver-demo",
    ".message-main-employee-demo",
    ".message-time-demo",
    ".reply-demo",
    ".khaIcon-demo",
  ];

  constructor(
    private widgetSetupService: WidgetSetupService,
    private ChatBotThemesService: ChatBotThemesService,
    private NotifyService: NotifyService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.widgetSetupService.config$.subscribe((widget) => {
      this.widgetStyle = widget;
    });
  }

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
      this.getChatBotThemes();
    });
  }

  //#region Crud theme
  getChatBotThemes() {
    this.chatBotThemesWidget = [];
    this.ChatBotThemesService.getAllChatBotThemes(this.chatBotId).subscribe({
      next: (data: any) => {
        this.chatBotThemesWidget = data.output;
        let isDefault = false;
        let defaultTheme;
        for (let i = 0; i < this.chatBotThemesWidget.length; i++) {
          if (
            this.chatBotThemesWidget[i].themeName.toLocaleLowerCase() ===
            "default"
          ) {
            isDefault = true;
            defaultTheme = this.chatBotThemesWidget[i];
            break;
          }
        }

        if (!isDefault) {
          this.ChatBotThemesService.createNewChatBotTheme(
            "default",
            this.chatBotId
          ).subscribe({
            next: (data: any) => {
              this.getChatBotThemes();
              this.changeWidgetTheme(data.output);
            },
            error: (error) => {
              this.NotifyService.openFailureSnackBar(error.message);
            },
          });
        } else {
          this.changeWidgetTheme(defaultTheme);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  createNewChatBotTheme(themeName: string) {
    this.ChatBotThemesService.createNewChatBotTheme(
      themeName,
      this.chatBotId
    ).subscribe({
      next: (data: any) => {
        this.NotifyService.openSuccessSnackBar(data.message);
        this.getChatBotThemes();
      },
      error: (error) => {
        this.NotifyService.openFailureSnackBar(error.message);
      },
    });
  }

  deleteTheme(themeId: string) {
    this.ChatBotThemesService.deleteTheme(themeId).subscribe({
      next: (data: any) => {
        this.NotifyService.openSuccessSnackBar(data.message);
        this.getChatBotThemes();
      },
      error: (error) => {
        this.NotifyService.openFailureSnackBar(error.message);
      },
    });
  }
  //#endregion

  //#region Dialogs
  openCreateThemeDialog() {
    this.dialog
      .open(CreateNewThemeComponent)
      .afterClosed()
      .subscribe((themeName) => {
        if (themeName) {
          this.createNewChatBotTheme(themeName);
        }
      });
  }

  openDeleteThemeDialog(themeId: string) {
    this.dialog
      .open(DeleteThemeComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.deleteTheme(themeId);
        }
      });
  }
  //#endregion

  //#region Updating Styles
  changeWidgetTheme(widgetTheme: WidgetStyle) {
    if (widgetTheme.header == null) widgetTheme.header = {} as HeaderCompStyle;
    if (widgetTheme.body == null) widgetTheme.body = {} as BodyCompStyle;
    if (widgetTheme.body.message == null)
      widgetTheme.body.message = {} as messageCompStyle;
    if (widgetTheme.body.message.roundedCorners == null)
      widgetTheme.body.message.roundedCorners = {} as RounededCorners;
    if (widgetTheme.body.message.listItems == null)
      widgetTheme.body.message.listItems = {} as MessageListItems;
    if (widgetTheme.body.message.mainListItems == null)
      widgetTheme.body.message.mainListItems = {} as mainMessageListItems;
    if (widgetTheme.footer == null) widgetTheme.footer = {} as TextboxCompStyle;

    // append the theme css styles and remove old style
    this.themeSelected.emit(widgetTheme);
    this.widgetStyle = widgetTheme;
    this.widgetSetConfig();
  }

  updatingSelectorStyles(selector: string, property: string, value: string) {
    debugger
    this.widgetSetupService.changeStyle(selector, property, value);
  }

  //#region updating images
  // updating background images src => content
  updatingImagesUrl(selector: string, url: string) {
    this.updatingSelectorStyles(selector, "content", `url(${url})`);
  }

  // updating background images
  updatingImagesBackground(selector: string, url: string) {
    this.updatingSelectorStyles(selector, "background-image", `url(${url})`);
  }

  //#endregion

  //#region updating borders
  selectMessagesBorderRadius(
    selector: string,
    borderRadius: RounededCorners
  ): void {
    if (selector == ".sender") {
      this.widgetStyle.body.message.roundedCorners = borderRadius;
      this.MessagesSelectedBorderRadius = borderRadius;
    } else if (selector == ".menu li") {
      this.widgetStyle.body.message.listItems.roundedCorners = borderRadius;
      this.listItemssSelectedBorderRadius = borderRadius;
    }
    this.updatingSelectorStyles(
      selector,
      "border-radius",
      borderRadius.value.toString() + borderRadius.unit
    );
  }
  //#endregion

  //#region updating toggling
  toggleLogo(widgetLogo: any, selector: string): void {
    widgetLogo.displayLogo = !widgetLogo.displayLogo;
    let displayLogo = widgetLogo.displayLogo ? "block" : "none";
    this.updatingSelectorStyles(selector, "display", displayLogo);
  }

  toggleTime(selector: string): void {
    this.widgetStyle.body.message.displayTime =
      !this.widgetStyle.body.message.displayTime;
    let displayLogo = this.widgetStyle.body.message.displayTime
      ? "block"
      : "none";
    this.updatingSelectorStyles(selector, "display", displayLogo);
  }

  toggleDisplayListItems(selector: string): void {
    if (selector == ".menu") {
      this.widgetStyle.body.message.listDisplay == "flex" ? "flex" : "block";
      this.updatingSelectorStyles(
        selector,
        "display",
        this.widgetStyle.body.message.listDisplay
      );
    } else if (selector == ".smenu") {
      this.widgetStyle.body.message.mainListDisplay == "flex"
        ? "flex"
        : "block";
      this.updatingSelectorStyles(
        selector,
        "display",
        this.widgetStyle.body.message.mainListDisplay
      );
    }
  }

  //#endregion

  updateItemsBgColor(selector: string, value: string): void {
    this.updatingSelectorStyles(selector, "background-color", value);
  }

  updateItemsTextColor(selector: string, value: string): void {
    this.updatingSelectorStyles(selector, "color", value);
  }
  //#endregion

  widgetSetConfig(): void {
    this.widgetSetupService.setConfig(this.widgetStyle);
  }

  isMessageRadSelected(roundedCorner: RounededCorners): boolean {
    return this.MessagesSelectedBorderRadius === roundedCorner;
  }

  isMessageListItemRadSelected(roundedCorner: RounededCorners): boolean {
    return this.listItemssSelectedBorderRadius === roundedCorner;
  }

  onPanelOpened(selector: string, index: number) {
    const panels = document.querySelectorAll("mat-expansion-panel");
    for (let i = 1; i < panels.length; i++) {
      if (i === index) {
        (panels[i] as HTMLElement).style["border"] = "3px dashed #61B431";
      } else {
        (panels[i] as HTMLElement).style["border"] =
          "1px solid rgba(155, 151, 151, 0.7)";
      }
    }
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
    this.panelsSelectors.forEach((panelSelector) => {
      if (panelSelector === selector) {
        this.widgetSetupService.changeStyle(
          selector,
          "border",
          "3px dashed #61B431"
        );
      } else {
        this.widgetSetupService.changeStyle(panelSelector, "border", "none");
      }
    });
  }

  onPanelClosed(selector: string, index: number) {
    const panels = document.querySelectorAll("mat-expansion-panel");
    for (let i = 1; i < panels.length; i++) {
      if (index == i) {
        (panels[i] as HTMLElement).style["border"] =
          "1px solid rgba(155, 151, 151, 0.7)";
        this.widgetSetupService.changeStyle(selector, "border", "none");
      }
    }
  }

  onFileSelected(event: any, imageName: string, selector: string) {
    this.selectedFile = event.target.files[0];
    let imageUrlLink = `${environment.URLS.GETRHImage}?chatBotId=${this.chatBotId}&channel=web&lang=ar&theme=${this.widgetStyle.themeName}&id=${imageName}`;
    if (this.selectedFile && this.selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = reader.result as string;
        const imageUrl = base64Image;
        switch (selector) {
          case ".org-logo":
            this.widgetStyle.header.headerLogoUrl = imageUrlLink;
            this.updatingImagesBackground(selector, imageUrl);
            break;
          case ".minimize":
            this.widgetStyle.header.minimizeLogoUrl = imageUrlLink;
            this.updatingImagesBackground(selector, imageUrl);
            break;
          case "#logoutIconId":
            this.widgetStyle.header.LogoutLogoUrl = imageUrlLink;
            this.updatingImagesBackground(selector, imageUrl);
            break;
          case ".sender::before":
            this.widgetStyle.body.botAvatarUrl = imageUrlLink;
            this.updatingImagesBackground(selector, imageUrl);
            break;
          case ".employee::before":
            this.widgetStyle.body.agentAvatarUrl = imageUrlLink;
            this.updatingImagesBackground(selector, imageUrl);
            break;
          case "#sendMessage img":
            this.widgetStyle.footer.sendingImageUrl = imageUrlLink;
            this.updatingImagesUrl(selector, imageUrl);
            break;
          case "#startSpeechId":
            this.widgetStyle.footer.recordingImageUrl = imageUrlLink;
            this.updatingImagesUrl(selector, imageUrl);
            break;
          case "#custServiceUploadAttmentId img":
            this.widgetStyle.footer.attachingFileImageUrl = imageUrlLink;
            this.updatingImagesUrl(selector, imageUrl);
            break;
          case "#custServiceConnectId img":
            this.widgetStyle.footer.closeCustomerServiceImageUrl = imageUrlLink;
            this.updatingImagesUrl(selector, imageUrl);
            break;
          case ".khaIcon img":
            this.widgetStyle.chatBotIcon = imageUrlLink;
            this.updatingImagesUrl(selector, imageUrl);
            break;
          default:
            break;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      alert("Please select an image");
      return;
    }
    event.target.value = "";

    this.ChatBotThemesService.uploadKHResource(
      imageName,
      this.selectedFile,
      this.chatBotId,
      this.widgetStyle.themeName
    );
  }
}
