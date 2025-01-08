import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";
import {
  BodyCompStyle,
  HeaderCompStyle,
  MessageListItems,
  RounededCorners,
  TextboxCompStyle,
  WidgetStyle,
  messageCompStyle,
} from "../core/models/widgetsetup-model";
import { ChatBotThemesService } from "./chat-bot-themes-service.service";

@Injectable({
  providedIn: "root",
})
export class WidgetSetupService {
  private isElementVisibleSubject = new BehaviorSubject<boolean>(false);
  public isElementVisible$ = this.isElementVisibleSubject.asObservable();

  private _defaultWidgetStyle: WidgetStyle = {
    primaryColor: "#031d37",
    secondaryColor: "#031d37",
    chatBotBackGroundImage:
      "https://orchestrator.alkhwarizmi.xyz/Projects/bgs/bg_296.png",
    header: {
      primaryBgColor: "#031d37",
      displayLogo: true,
      headerLogoUrl: "../../assets/images/rb-avater.png",
      LogoutLogoUrl: "../../assets/images/logout.png",
      minimizeLogoUrl: "../../assets/images/mdi_close.png",
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
      botAvatarUrl: "../../assets/images/rb-avater.png",
      agentAvatarUrl: "../../assets/images/employee_icon.png",
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
      recordingImageUrl: "../../assets/images/microphone_150.png",
      textImageUrl: "../../assets/images/sharelocation.png",
      attachingFileImageUrl: "../../assets/images/attachment_icon_150.png",
      closeCustomerServiceImageUrl:
        "../../assets/images/customer_service_close_150.png",
      sendingImageUrl: "../../assets/images/send_150.png",
      activeBorderColor: "#fff",
      borderColor: "#fff",
    },
  };

  private _configSubject = new BehaviorSubject<WidgetStyle>(
    this._defaultWidgetStyle
  );

  config$: Observable<WidgetStyle> = this._configSubject.asObservable();

  constructor() {
    // This listens when there is an update in the widget => like selecting other widget
    this.config$.subscribe((config) => {
      this.changeWidgetCssStyles(config);
    });
  }

  setElementVisibility(isVisible: boolean): void {
    this.isElementVisibleSubject.next(isVisible);
  }

  /**
   * This method upadates css styles or rules based on the selected widget
   * When emiiting a new value for the widget or selecting a new widget this method gets fired
   * @param widgetTheme The updated widgetSetup model
   */
  changeWidgetCssStyles(widgetTheme: WidgetStyle): void {
    //#region rules
    const rulesStyles = [
      {
        selector: ".kha-heading",
        property: "background",
        value: widgetTheme?.header?.primaryBgColor,
      },
      // {
      //   selector: ".org-logo",
      //   property: "background",
      //   value: `${
      //     widgetTheme?.header?.headerLogoUrl == null
      //       ? null
      //       : "url(" + widgetTheme?.header?.headerLogoUrl + ")" + " no-repeat"
      //   }`,
      // },
      {
        selector: ".org-logo",
        property: "background-image",
        value: `${
          widgetTheme?.header?.headerLogoUrl == null
            ? null
            : "url(" + widgetTheme?.header?.headerLogoUrl + ")"
        }`,
      },
      {
        selector: ".org-logo",
        property: "background-size",
        value: "contain",
      },
        {
        selector: ".org-logo",
        property: "background-repeat",
        value: "no-repeat",
      },
      {
        selector: ".minimize",
        property: "background-image",
        value: `${
          widgetTheme?.header?.minimizeLogoUrl == null
            ? null
            : "url(" + widgetTheme?.header?.minimizeLogoUrl + ")"
        }`,
      },
      {
        selector: ".minimize",
        property: "margin-top",
        value: "0px",
      },

      {
        selector: ".minimize",
        property: "background-size",
        value: "cover",
      },

      {
        selector: ".minimize",
        property: "width",
        value: "20px",
      },

      {
        selector: ".minimize",
        property: "height",
        value: "20px",
      },
      {
        selector: "#logoutIconId",
        property: "background",
        value: `${
          widgetTheme?.header?.LogoutLogoUrl == null
            ? null
            : "url(" + widgetTheme?.header?.LogoutLogoUrl + ")" + " no-repeat"
        }`,
      },
      {
        selector: ".message",
        property: "background-color",
        value: widgetTheme?.body?.backgroundColor,
      },
      {
        selector: ".sender",
        property: "background",
        value: widgetTheme?.body?.message?.senderBackgroundColor,
      },
      {
        selector: ".receiver",
        property: "background-color",
        value: widgetTheme?.body?.message?.receiverBackgroundColor,
      },
      {
        selector: ".receiver",
        property: "color",
        value: widgetTheme?.body?.message?.userTextColor,
      },
      {
        selector: ".employee",
        property: "background",
        value: widgetTheme?.body?.message?.CustomerServBackgroundColor,
      },
      {
        selector: ".menu li:hover",
        property: "color",
        value: widgetTheme?.body?.message?.listItems?.hoverTextColor,
      },
      {
        selector: ".menu li:hover",
        property: "border-bottom-color",
        value: widgetTheme?.body?.message?.listItems?.borderBottomColor,
      },
      {
        selector: ".menu li:hover",
        property: "background-color",
        value: widgetTheme?.body?.message?.listItems?.hoverBgColor,
      },
      {
        selector: ".menu li",
        property: "background-color",
        value: widgetTheme?.body?.message?.listItems?.backgroundColor,
      },
      {
        selector: ".menu li",
        property: "color",
        value: widgetTheme?.body?.message?.listItems?.textColor,
      },

      {
        selector: ".smenu li:hover",
        property: "color",
        value: widgetTheme?.body?.message?.mainListItems?.hoverTextColor,
      },

      {
        selector: ".smenu li:hover",
        property: "background-color",
        value: widgetTheme?.body?.message?.mainListItems?.hoverBgColor,
      },
      {
        selector: ".smenu li",
        property: "background-color",
        value: widgetTheme?.body?.message?.mainListItems?.backgroundColor,
      },
      {
        selector: ".smenu li",
        property: "color",
        value: widgetTheme?.body?.message?.mainListItems?.textColor,
      },
      {
        selector: ".smenu li",
        property: "border-radius",
        value:
          widgetTheme?.body?.message?.mainListItems?.roundedCorners?.value +
          widgetTheme?.body?.message?.mainListItems?.roundedCorners?.unit,
      },
      {
        selector: ".smenu li",
        property: "border-color",
        value: widgetTheme?.body?.message?.mainListItems?.borderColor,
      },
      {
        selector: ".smenu",
        property: "display",
        value: widgetTheme?.body?.message?.mainListDisplay,
      },

      {
        selector: ".employee::before",
        property: "background-image",
        value: `${
          widgetTheme?.body?.agentAvatarUrl == null
            ? null
            : "url(" + widgetTheme?.body?.agentAvatarUrl + ")"
        }`,
      },
      {
        selector: ".sender::before",
        property: "background-image",
        value: `${
          widgetTheme?.body?.botAvatarUrl == null
            ? null
            : "url(" + widgetTheme?.body?.botAvatarUrl + ") "
        }`,
      },
      {
        selector: ".sender::before",
        property: "background-image",
        value: `${
          widgetTheme?.body?.botAvatarUrl == null
            ? null
            : "url(" + widgetTheme?.body?.botAvatarUrl + ") "
        }`,
      },
      {
        selector: ".message-time",
        property: "display",
        value: widgetTheme?.body?.message?.displayTime ? "block" : "none",
      },
      {
        selector: ".sender",
        property: "border-radius",
        value:
          widgetTheme?.body?.message?.roundedCorners.value +
          widgetTheme?.body?.message?.roundedCorners.unit,
      },
      {
        selector: ".menu li",
        property: "border-radius",
        value:
          widgetTheme?.body?.message?.listItems?.roundedCorners?.value +
          widgetTheme?.body?.message?.listItems?.roundedCorners?.unit,
      },
      {
        selector: ".menu li",
        property: "border-color",
        value: widgetTheme?.body?.message?.listItems?.borderColor,
      },
      {
        selector: ".menu",
        property: "display",
        value: widgetTheme?.body?.message?.listDisplay,
      },
      {
        selector: "#sendMessage img",
        property: "content",
        value: `${
          widgetTheme?.footer?.sendingImageUrl == null
            ? null
            : "url(" + widgetTheme?.footer?.sendingImageUrl + ")"
        }`,
      },
      {
        selector: "#startSpeechId",
        property: "content",
        value: `${
          widgetTheme?.footer?.recordingImageUrl == null
            ? null
            : "url(" + widgetTheme?.footer?.recordingImageUrl + ")"
        }`,
      },
      {
        selector: "#custServiceUploadAttmentId img",
        property: "content",
        value: `${
          widgetTheme?.footer?.attachingFileImageUrl == null
            ? null
            : "url(" + widgetTheme?.footer?.attachingFileImageUrl + ")"
        }`,
      },
      {
        selector: "#custServiceConnectId img",
        property: "content",
        value: `${
          widgetTheme?.footer?.closeCustomerServiceImageUrl == null
            ? null
            : "url(" + widgetTheme?.footer?.closeCustomerServiceImageUrl + ")"
        }`,
      },
      {
        selector: ".khaIcon img",
        property: "content",
        value: `${
          widgetTheme?.chatBotIcon == null
            ? null
            : "url(" + widgetTheme?.chatBotIcon + ")"
        }`,
      },
      // {
      //   selector: ".sender .message-text p,.sender .message-text",
      //   property: "color",
      //   value: widgetTheme?.body?.message?.botTextColor,
      // },//
      {
        selector: ".sender",
        property: "color",
        value: widgetTheme?.body?.message?.botTextColor,
       },
      {
        selector: ".message-text p",
        property: "color",
        value: widgetTheme?.body?.message?.botTextColor,
      },
      //footer
      {
        selector: ".reply",
        property: "background-color",
        value: widgetTheme?.footer?.footerBackground,
      },
      {
        selector: ".reply-main",
        property: "background-color",
        value: widgetTheme?.footer?.replyBackground,
      },
       {
        selector: ".utterance-editor",
        property: "background-color",
        value: widgetTheme?.footer?.replyBackground,
      },
      {
        selector: ".utterance-editor",
        property: "color",
        value: widgetTheme?.footer?.textAreaInputcolor,
      },

      {
        selector: "textarea::placeholder",
        property: "color",
        value: widgetTheme?.footer?.textAreaPlaceHodercolor,
      },

      {
        selector: ".utterance-editor",
        property: "width",
        value: "-webkit-fill-available",
      },

       {
        selector: ".utterance-editor",
        property: "margin",
        value: "5px 5px -5px 5px",
      },

      {
        selector: ".more",
        property: "color",
        value: widgetTheme?.body?.moreTextColor,
      },
      {
        selector: ".yes",
        property: "color",
        value: widgetTheme?.body?.yesTextColor,
      },
      {
        selector: ".yes",
        property: "border-color",
        value: widgetTheme?.body?.yesBorderColor,
      },
      {
        selector: ".yes",
        property: "background",
        value: widgetTheme?.body?.yesBackgroundColor,
      },
      {
        selector: ".no",
        property: "color",
        value: widgetTheme?.body?.noTextColor,
      },
      {
        selector: ".no",
        property: "border-color",
        value: widgetTheme?.body?.noBorderColor,
      },
      {
        selector: ".no",
        property: "background",
        value: widgetTheme?.body?.noBackgroundColor,
      },
      {
        selector: ".message::-webkit-scrollbar-thumb",
        property: "background-color",
        value: widgetTheme?.body?.scrollBgColor,
      },
    ];
    //#endregion
    console.log('reule',rulesStyles[34])
    rulesStyles.forEach(({ selector, property, value }) => {
      if (value != null) this.changeStyle(selector, property, value);
    });
  }

  /**
   * Sets the configuration of the widget.
   * This method updates the widget configuration and triggers the emission of the new configuration value to subscribers.
   * @param config The updated widget configuration.
   */
  setConfig(config: WidgetStyle): void {
    this._configSubject.next(config);
  }

  /**
   * Updates CSS rules based on the provided selector, property, and value.
   * This method accesses the styleSheet elements and modifies the CSS rules that match the given selector.
   * @param selector The CSS selector for the rules to be updated.
   * @param property The CSS property to be modified.
   * @param value The new value for the CSS property.
   */
  changeStyle(selector: string, property: string, value: string): void {
    const widgetBaseLibSheet = document.getElementById(
      "widgetBaseLibSheet"
    ) as HTMLStyleElement;
    const widgetBaseStyleSheet = document.getElementById(
      "widgetBaseStyleSheet"
    ) as HTMLStyleElement;

    if (!widgetBaseLibSheet || !widgetBaseStyleSheet) {
      return;
    }

    const libSheetRules = Array.from(
      widgetBaseLibSheet.sheet!.cssRules
    ) as CSSStyleRule[];
    const baseSheetRules = Array.from(
      widgetBaseStyleSheet.sheet!.cssRules
    ) as CSSStyleRule[];

    const updateRules = (rules: CSSStyleRule[]) => {
      rules.forEach((rule) => {
        if (
          rule.selectorText === selector &&
          value !== null &&
          value !== undefined
        ) {
          if (
            selector == ".message::-webkit-scrollbar-thumb" &&
            property == "background-color"
          ) {
            this.changeStyle(".nicescroll-cursors", "background", value);
            rule.style.setProperty(property, value, "important"); // Set with !important
          } else {
            if (
              (selector === ".menu li" && property == "border-color") ||
              (selector === ".menu li" && property == "border")
            ) {
              rule.style.setProperty(
                "border",
                `1px solid ${value}`,
                "important"
              ); // Set with !important
            } else {
              if (
                (selector === ".reply" && property == "border-color") ||
                (selector === ".reply" && property == "border")
              ) {
                rule.style.setProperty(
                  "border",
                  `1px solid ${value}`,
                  "important"
                ); // Set with !important
              } else {
                rule.style.setProperty(property, value, "important"); // Set with !important
              }
            }
          }
        }
      });
    };

    updateRules(libSheetRules);
    updateRules(baseSheetRules);
  }
}
